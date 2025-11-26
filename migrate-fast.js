// migrate-fast.js (VERSÃO ULTRA RÁPIDA)
const Database = require('better-sqlite3')
const { Client } = require('pg')
const fs = require('fs')
const { pipeline } = require('stream/promises')
const { Readable, Transform } = require('stream')

const client = new Client({
  connectionString: 'postgresql://postgres:oMlOxTFUbwlSLYnoNqTcNMGeoTKsDlzN@shortline.proxy.rlwy.net:51503/railway',
  ssl: { rejectUnauthorized: false }
})

const SQLITE_FILE = 'C:\\Users\\andre\\Downloads\\cnpj_atualizado_out_25.db'
const SKIP_TABLES = ['_referencia', 'cnae']

async function migrateTableBulk(tableName, sqliteDb) {
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
    
    // Criar CSV temporário
    const csvFile = `temp_${tableName}.csv`
    const writeStream = fs.createWriteStream(csvFile)
    
    console.log(`📝 Exportando para CSV...`)
    
    // Exportar em lotes
    const batchSize = 10000
    let exported = 0
    
    for (let offset = 0; offset < totalRows; offset += batchSize) {
      const rows = sqliteDb.prepare(
        `SELECT * FROM "${tableName}" LIMIT ${batchSize} OFFSET ${offset}`
      ).all()
      
      for (const row of rows) {
        const values = columnNames.map(col => {
          const val = row[col]
          if (val === null) return '\\N'
          if (typeof val === 'string') return val.replace(/\\/g, '\\\\').replace(/\t/g, '\\t').replace(/\n/g, '\\n')
          return String(val)
        })
        writeStream.write(values.join('\t') + '\n')
        exported++
      }
      
      if (exported % 100000 === 0) {
        console.log(`   Exportado: ${exported.toLocaleString()}/${totalRows.toLocaleString()} (${Math.round(exported/totalRows*100)}%)`)
      }
    }
    
    writeStream.end()
    await new Promise(resolve => writeStream.on('finish', resolve))
    
    console.log(`✅ CSV criado: ${csvFile}`)
    console.log(`⚡ Importando em massa (BULK)...`)
    
    const startTime = Date.now()
    
    // COPY - SUPER RÁPIDO!
    const copyQuery = `
      COPY "${tableName}" (${columnNames.map(c => `"${c}"`).join(', ')})
      FROM STDIN WITH (FORMAT text, DELIMITER E'\\t', NULL '\\N')
    `
    
    const fileStream = fs.createReadStream(csvFile)
    const copyStream = client.query(require('pg-copy-streams').from(copyQuery))
    
    fileStream.pipe(copyStream)
    
    await new Promise((resolve, reject) => {
      copyStream.on('finish', resolve)
      copyStream.on('error', reject)
    })
    
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1)
    const rate = Math.round(totalRows / elapsed)
    
    console.log(`✅ Tabela ${tableName} migrada!`)
    console.log(`   ${totalRows.toLocaleString()} registros em ${elapsed}s (${rate.toLocaleString()} reg/s)`)
    
    // Limpar CSV
    fs.unlinkSync(csvFile)
    
  } catch (error) {
    console.error(`❌ Erro ao migrar ${tableName}:`, error.message)
  }
}

async function main() {
  console.log('🚀 MIGRAÇÃO ULTRA RÁPIDA - MODO BULK\n')
  
  await client.connect()
  
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
    await migrateTableBulk(table.name, sqliteDb)
  }
  
  sqliteDb.close()
  await client.end()
  
  console.log('\n🎉 ✅ MIGRAÇÃO COMPLETA!')
}

main().catch(console.error)