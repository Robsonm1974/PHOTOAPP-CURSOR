import Database from 'better-sqlite3'

let db: Database.Database | null = null

function ensureDatabase(): Database.Database {
  if (db) return db

  // Cria/abre o arquivo local do banco
  db = new Database('./local-database.db')
  db.pragma('foreign_keys = ON')

  // Tabelas mínimas para funcionar
  db.exec(`
    CREATE TABLE IF NOT EXISTS events (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      start_date TEXT NOT NULL,
      end_date TEXT,
      school TEXT NOT NULL,
      contact TEXT NOT NULL,
      phone TEXT NOT NULL,
      commission REAL NOT NULL DEFAULT 15.0,
      photo_price REAL NOT NULL DEFAULT 25.0,
      notes TEXT,
      participants_count INTEGER NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'upcoming'
    );

    CREATE TABLE IF NOT EXISTS participants (
      id TEXT PRIMARY KEY,
      event_id TEXT NOT NULL,
      name TEXT NOT NULL,
      class TEXT NOT NULL,
      type TEXT NOT NULL DEFAULT 'aluno',
      qr_code TEXT UNIQUE,
      photos TEXT,
      profile_photo TEXT,
      FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_participants_event_id ON participants(event_id);

    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      name TEXT
    );
  `)

  // Dados de exemplo somente se estiver vazio
  const row = db.prepare('SELECT COUNT(*) as c FROM events').get() as { c: number }
  if (row.c === 0) {
    const insertEvent = db.prepare(`
      INSERT INTO events (id, title, start_date, end_date, school, contact, phone, commission, photo_price, notes, participants_count, status)
      VALUES (@id, @title, @start_date, @end_date, @school, @contact, @phone, @commission, @photo_price, @notes, @participants_count, @status)
    `)

    insertEvent.run({
      id: '1',
      title: 'Dia da Foto - Escola Primária',
      start_date: '2024-03-10',
      end_date: '2024-03-10',
      school: 'Escola Primária Sol Nascente',
      contact: 'Maria Silva',
      phone: '(11) 99999-9999',
      commission: 15.0,
      photo_price: 25.0,
      notes: 'Evento anual para fotos de turma e individuais.',
      participants_count: 45,
      status: 'active'
    })

    insertEvent.run({
      id: '2',
      title: 'Formatura - Colégio Estadual',
      start_date: '2024-07-15',
      end_date: '2024-07-17',
      school: 'Colégio Estadual Futuro Brilhante',
      contact: 'João Santos',
      phone: '(11) 88888-8888',
      commission: 20.0,
      photo_price: 30.0,
      notes: 'Sessões de fotos para formandos do 3º ano do ensino médio.',
      participants_count: 120,
      status: 'upcoming'
    })

    const insertParticipant = db.prepare(`
      INSERT INTO participants (id, event_id, name, class, type, qr_code, photos, profile_photo)
      VALUES (@id, @event_id, @name, @class, @type, @qr_code, @photos, @profile_photo)
    `)

    insertParticipant.run({
      id: 'p1', event_id: '1', name: 'Ana Clara', class: '3º Ano A', type: 'aluno',
      qr_code: '123456', photos: JSON.stringify(['/photos/ana_clara_1.jpg', '/photos/ana_clara_2.jpg']), profile_photo: '/photos/ana_clara_1.jpg'
    })
    insertParticipant.run({
      id: 'p2', event_id: '1', name: 'Bruno Lima', class: '3º Ano A', type: 'aluno',
      qr_code: '654321', photos: JSON.stringify(['/photos/bruno_lima_1.jpg']), profile_photo: '/photos/bruno_lima_1.jpg'
    })

    // Usuário padrão para desenvolvimento (uso apenas em dev)
    const insertUser = db.prepare(`
      INSERT OR IGNORE INTO users (id, email, password, name) VALUES (@id, @email, @password, @name)
    `)
    insertUser.run({ id: 'u1', email: 'robsonm1974@gmail.com', password: '1234', name: 'Robson' })
  }

  return db
}

export function dbAll<T = any>(sql: string, params?: any): T[] {
  const database = ensureDatabase()
  const stmt = database.prepare(sql)
  // @ts-ignore
  return params ? stmt.all(params) : stmt.all()
}

export function dbGet<T = any>(sql: string, params?: any): T | undefined {
  const database = ensureDatabase()
  const stmt = database.prepare(sql)
  // @ts-ignore
  return params ? stmt.get(params) : stmt.get()
}

export function dbRun(sql: string, params?: any): Database.RunResult {
  const database = ensureDatabase()
  const stmt = database.prepare(sql)
  // @ts-ignore
  return params ? stmt.run(params) : stmt.run()
}


