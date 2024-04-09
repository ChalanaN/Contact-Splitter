const CONTACTS_PER_CHUNK = 20,
    OUT_DIR = './out/'

const sourceFile = Bun.file('./source.csv');

type Result = {
    name: string
    grade: string
    class: string
    phone: string
    marks: string
}

// Convert CSV to JSON 🦄

const dataArr = (await sourceFile.text()).split('\n').map(line => line.split(',').map(cell => cell.trim()));

const data: Result[] = []

let headers: string[] = []

dataArr.forEach((row, i) => {
    if (i == 0) {
        headers = row.map(cell => cell.toLowerCase())
    } else {
        row[0] && data.push(row.reduce((acc, cell, j) => {
            // @ts-ignore
            acc[headers[j]] = cell
            return acc
        }, {} as Result))
    }
});

const contactChunks = []

for (let i = 0; i < data.length; i += CONTACTS_PER_CHUNK) {
    contactChunks.push(data.slice(i, i + CONTACTS_PER_CHUNK))
}

contactChunks.forEach((chunk, i) => {
    Bun.write(OUT_DIR + `chunk_${i}.csv`, generateCSV(chunk))
})

function generateCSV(chunk: Result[]) {
    let csv = "First Name,Last Name,Mobile Phone\n"

    csv += chunk.map(contact => `G${contact.grade} - RCAS,- ${contact.name},0${contact.phone}`).join('\n')

    return csv
}