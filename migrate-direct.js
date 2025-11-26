// migrate-direct.js (SEM CSV - INSERÇÃO DIRETA)
const Database = require('better-sqlite3')
const { Pool } = require('pg')

const pool = new Pool({
  connectionString: 'postgresql://postgres:oMlOxTFUbwlSLYnoNqTcNMGeoTKsDlzN@shortline.proxy.rlwy.net:51503/railway',
  ssl: { rejectUnauthorized: false }
})

const SQLITE_FILE = 'C:\\Users\\andre\\Downloads\\cnpj_atualizado_out_25.db'
const SKIP_TABLES = ['_referencia', 'cnae', 'empresas']  // ← adicione empresas

async function migrateTableDirect(tableName, sqliteDb) {
  console.log(`\n🔄 Migrando tabela: ${tableName}`)
  
  try {
    // Schema
    const schemaInfo = sqliteDb.prepare(`PRAGMA table_info("${tableName}")`).all()
    
    const columns = schemaInfo.map(col => {
      let type = col.type.toUpperCase()
      if (type.includes('INT')) type = 'INTEGER'
      else if (type.includes('TEXT') || type.includes('VARCHAR')) type = 'TEXT'
      else if (type.includes('REAL') || type.includes('DOUBLE')) type = 'NUMERIC'
      else if (type.includes('BLOB')) type = 'BYTEA'
      else if (!type) type = 'TEXT'
      return `"${col.name}" ${type}`
    }).join(', ')
    
    // Criar tabela
    await pool.query(`DROP TABLE IF EXISTS "${tableName}" CASCADE`)
    await pool.query(`CREATE TABLE "${tableName}" (${columns})`)
    console.log(`✅ Tabela ${tableName} criada`)
    
    // Contar
    const countResult = sqliteDb.prepare(`SELECT COUNT(*) as total FROM "${tableName}"`).get()
    const totalRows = countResult.total
    console.log(`📊 ${totalRows.toLocaleString()} registros para migrar`)
    
    if (totalRows === 0) return
    
    const columnNames = schemaInfo.map(c => c.name)
    const batchSize = 1000
    let inserted = 0
    
    console.log(`⚡ Inserindo em lotes de ${batchSize.toLocaleString()}...`)
    
    // Iterar com streaming
    const stmt = sqliteDb.prepare(`SELECT * FROM "${tableName}"`)
    const placeholders = columnNames.map((_, i) => `$${i + 1}`).join(', ')
    const insertQuery = `INSERT INTO "${tableName}" (${columnNames.map(c => `"${c}"`).join(', ')}) VALUES (${placeholders})`
    
    let batch = []
    
    for (const row of stmt.iterate()) {
      batch.push(row)
      
      if (batch.length >= batchSize) {
        // Inserir batch
        const client = await pool.connect()
        try {
          await client.query('BEGIN')
          
          for (const r of batch) {
            const values = columnNames.map(col => r[col])
            await client.query(insertQuery, values)
          }
          
          await client.query('COMMIT')
          inserted += batch.length
        } catch (e) {
          await client.query('ROLLBACK')
          console.error(`   ⚠️ Erro no batch: ${e.message}`)
        } finally {
          client.release()
        }
        
        batch = []
        
        // Progresso
        if (inserted % 50000 === 0) {
          const percent = Math.round((inserted / totalRows) * 100)
          console.log(`   Progresso: ${inserted.toLocaleString()}/${totalRows.toLocaleString()} (${percent}%)`)
        }
      }
    }
    
    // Inserir último batch
    if (batch.length > 0) {
      const client = await pool.connect()
      try {
        await client.query('BEGIN')
        
        for (const r of batch) {
          const values = columnNames.map(col => r[col])
          await client.query(insertQuery, values)
        }
        
        await client.query('COMMIT')
        inserted += batch.length
      } catch (e) {
        await client.query('ROLLBACK')
      } finally {
        client.release()
      }
    }
    
    console.log(`✅ Tabela ${tableName} migrada! ${inserted.toLocaleString()} registros`)
    
  } catch (error) {
    console.error(`❌ Erro ao migrar ${tableName}:`, error.message)
  }
}

async function main() {
  console.log('🚀 MIGRAÇÃO DIRETA - SEM CSV\n')
  
  const sqliteDb = new Database(SQLITE_FILE, { readonly: true })
  
  const tables = sqliteDb.prepare(`
    SELECT name FROM sqlite_master 
    WHERE type='table' 
    AND name NOT LIKE 'sqlite_%'
    ORDER BY name
  `).all()
  
  console.log(`📋 ${tables.length} tabelas encontradas\n`)
  
  for (const table of tables) {
    if (SKIP_TABLES.includes(table.name)) {
      console.log(`⏭️  Pulando ${table.name}`)
      continue
    }
    await migrateTableDirect(table.name, sqliteDb)
  }
  
  sqliteDb.close()
  await pool.end()
  
  console.log('\n🎉 ✅ MIGRAÇÃO COMPLETA!')
}

main().catch(console.error)