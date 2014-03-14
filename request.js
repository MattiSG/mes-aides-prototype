var statmatMap = {
    'seul': 'Célibataire',
    'en concubinage': 'Célibataire',
    'pacsé.e': 'Pacsé',
    'marié.e': 'Marié'
};

var tenancyMap = {
    'locataire': 'Locataire ou sous-locataire d\'un logement loué vide non-HLM',
    'propriétaire': 'Propriétaire (non accédant) du logement'
};

function simulate(v) {
    var dfd = $.Deferred();

    var firstPerson = {
        activite: 'Actif occupé',
        birth: (2014 - parseInt(v.age, 10)) + '-01-01',
        id: 'ind0',
        sali: (parseInt(v.minus1) + parseInt(v.minus2) + parseInt(v.minus3)) * 4,
        statmarit: statmatMap[v.marital]
    };
    var secondPerson = _.clone(firstPerson);
    secondPerson.id = 'ind1';
    var individus = v.marital === 'seul' ? [firstPerson] : [firstPerson, secondPerson];
    var menages = {
        personne_de_reference: 'ind0',
        so: tenancyMap[v.tenancy],
        loyer: parseInt(v.rent)
    };
    var scenario = {
        test_case: {
            familles: [
                { parents: ['ind0'] }
            ],
            foyers_fiscaux: [
                { declarants: ['ind0'] }
            ],
            individus: individus,
            menages: [menages]
        },
        legislation_url: 'http://api.openfisca.fr/api/1/default-legislation',
        year: 2013
    };

    $.ajax({
        method: 'POST',
        url: 'http://api.openfisca.fr/api/1/simulate',
        data: JSON.stringify({ scenarios: [scenario] }),
        dataType: 'json',
        contentType: 'application/json'
    }).done(function(data) {
        var result = {};
        result[data.value.children[2].children[1].children[0].name] = data.value.children[2].children[1].children[0].values[0];
        result[data.value.children[2].children[2].children[0].name] = data.value.children[2].children[2].children[0].values[0];
        result[data.value.children[2].children[2].children[1].name] = data.value.children[2].children[2].children[1].values[0];
        dfd.resolve(result);
    });

    return dfd.promise();
}
