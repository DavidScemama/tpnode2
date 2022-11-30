const express = require('express')
const app = express()
const port = 3000

app.get('/rendu2', (req, res) => {
    const download = require('download');
    const fs = require('fs')
    const csv = require('csv-parser')
    const results = [];
    const unzip = require('unzip-stream')

   download('https://files.data.gouv.fr/insee-sirene/StockEtablissementLiensSuccession_utf8.zip', 'data').then(() => {
        fs.createReadStream('data/Data.zip')
        .pipe(unzip.Parse())
        .on('entry', function (entry) {
            const file = entry.path;
            const type = entry.type;
            const size = entry.size;
            if (file === "Data8.csv") {
                entry.pipe(csv())
                .on('data', (data) => results.push(data))
                .on('end', () => {
                    const transfert = results.filter(result => result.transfertSiege == 'true')
                    const pourcent = transfert.length / results.length * 100
                    let resultat = pourcent.toFixed(1)
                    res.send(`Le pourcentage de société qui ont transféré leur siège social depuis le 1er Novembre 2022 est de ${pourcent.toFixed(3)}%`)
                } )
            } else {
                entry.autodrain();
            }
        });
})
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
