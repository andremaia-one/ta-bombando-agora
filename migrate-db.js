// migrate-db.js (VERSÃO STREAMING PURO)
const Database = require('better-sqlite3')
const { Client } = require('pg')
const fs = require('fs')
const copyFrom = require('pg-copy-streams').from

const client = new Client({
  connectionString: 'postgresql://postgres:oMlOxTFUbwlSLYnoNqTcNMGeoTKsDlzN@shortline.proxy.rlwy.net:51503/railway',
  ssl: { rejectUnauthorized: false }
})

const SQLITE_FILE = 'C:\\Users\\andre\\Downloads\\cnpj_atualizado_out_25.db'
const SKIP_TABLES = ['_referencia', 'cnae', 'empresas', 'estabelecimento', 'socios', 'simples']

async function migrateTableStreaming(tableName, sqliteDb) {
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
    await client.query(`DROP TABLE IF EXISTS "${tableName}" CASCADE`)
    await client.query(`CREATE TABLE "${tableName}" (${columns})`)
    console.log(`✅ Tabela ${tableName} criada`)
    
    // Contar
    const countResult = sqliteDb.prepare(`SELECT COUNT(*) as total FROM "${tableName}"`).get()
    const totalRows = countResult.total
    console.log(`📊 ${totalRows.toLocaleString()} registros para migrar`)
    
    if (totalRows === 0) return
    
    const columnNames = schemaInfo.map(c => c.name)
    const csvFile = `temp_${tableName}.csv`
    
    console.log(`📝 Exportando e importando em streaming...`)
    
    // Criar write stream para CSV
    const writeStream = fs.createWriteStream(csvFile)
    
    // Exportar em streaming (baixa memória)
    let exported = 0
    const stmt = sqliteDb.prepare(`SELECT * FROM "${tableName}"`)
    
    for (const row of stmt.iterate()) {
      const values = columnNames.map(col => {
        const val = row[col]
        if (val === null) return '\\N'
        if (typeof val === 'string') {
          return val
            .replace(/\\/g, '\\\\')
            .replace(/\t/g, '\\t')
            .replace(/\n/g, '\\n')
            .replace(/\r/g, '\\r')
        }
        return String(val)
      })
      
      writeStream.write(values.join('\t') + '\n')
      exported++
      
      // Progresso a cada 50k (menos poluição)
      if (exported % 50000 === 0) {
        const percent = Math.round((exported / totalRows) * 100)
        console.log(`   Progresso: ${exported.toLocaleString()}/${totalRows.toLocaleString()} (${percent}%)`)
      }
    }
    
    writeStream.end()
    await new Promise(resolve => writeStream.on('finish', resolve))
    
    console.log(`✅ ${exported.toLocaleString()} registros exportados`)
    console.log(`⚡ Importando em massa (BULK)...`)
    
    const startTime = Date.now()
    
    // COPY direto do arquivo
    const copyQuery = `
      COPY "${tableName}" (${columnNames.map(c => `"${c}"`).join(', ')})
      FROM STDIN WITH (FORMAT text, DELIMITER E'\\t', NULL '\\N')
    `
    
    const fileStream = fs.createReadStream(csvFile)
    const copyStream = client.query(copyFrom(copyQuery))
    
    fileStream.pipe(copyStream)
    
    await new Promise((resolve, reject) => {
      copyStream.on('finish', resolve)
      copyStream.on('error', reject)
      fileStream.on('error', reject)
    })
    
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1)
    const rate = Math.round(totalRows / (elapsed + 0.01))
    
    console.log(`✅ Tabela ${tableName} migrada!`)
    console.log(`   Import: ${elapsed}s (${rate.toLocaleString()} reg/s)`)
    
    // Limpar CSV
    try {
      fs.unlinkSync(csvFile)
    } catch (e) {
      console.log(`   ⚠️ Não foi possível deletar ${csvFile}`)
    }
    
  } catch (error) {
    console.error(`❌ Erro ao migrar ${tableName}:`, error.message)
    console.error(error.stack)
  }
}

async function main() {
  console.log('🚀 MIGRAÇÃO STREAMING PURO - ZERO MEMÓRIA\n')
  
  if (!fs.existsSync(SQLITE_FILE)) {
    console.error(`❌ Arquivo não encontrado: ${SQLITE_FILE}`)
    process.exit(1)
  }
  
  await client.connect()
  console.log('✅ Conectado ao PostgreSQL\n')
  
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
      console.log(`⏭️  Pulando ${table.name} (já migrada)`)
      continue
    }
    await migrateTableStreaming(table.name, sqliteDb)
  }
  
  sqliteDb.close()
  await client.end()
  
  console.log('\n🎉 ✅ MIGRAÇÃO COMPLETA!')
  console.log('\nVerifique: http://localhost:3000/api/debug-tables')
}

main().catch(err => {
  console.error('💥 ERRO FATAL:', err)
  process.exit(1)
})