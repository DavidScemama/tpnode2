
var express = require('express');
var app = express();
var port = 3000;

app.get('/rendu2', function (req, res) {
    var telechargement = require('download');
    var fs = require('fs');
    var csv = require('csv-parser');
    var unzip = require('unzip-stream');
    var transfert = 0;
    var total = 0;
    telechargement('https://files.data.gouv.fr/insee-sirene/StockEtablissementLiensSuccession_utf8.zip', 'data').then(function () {
        fs.createReadStream('data/Data.zip').pipe(unzip.Parse()).on('entry', function (entry) {
            var file = entry.path;
            
            if (file === "Data.csv") {
                entry.pipe(csv())
                    .on('data', function (data) { 

                        total = total + 1 ; 

                        if (data.transfertSiege == 'true'){
                            transfert = transfert + 1;
                        } 
                     })
                    .on('end', function () {
                    var percent = transfert / total * 100;
                    var resultats = percent.toFixed(3);
                    res.send(`Le pourcentage de société qui ont transféré leur siège social depuis le 1er Novembre 2022 est de ${pourcent.toFixed(3)}%`);
                });
            }
            else {
                entry.autodrain();
            }
        });
    });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
