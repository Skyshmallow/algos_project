self.GOOGLE_RECAPTCHA_PUBLIC_KEY = "6LfnRQ8TAAAAAN9rP3skbWdI9NjmJSjaE0budP1H";
self.RATING_BANDS = [{
    "color": "rgb(226, 17, 0)",
    "maxRating": 3000,
    "minRating": 1900
}, {
    "color": "rgb(241, 196, 0)",
    "maxRating": 1900,
    "minRating": 1800
}, {
    "color": "rgb(0, 118, 234)",
    "maxRating": 1800,
    "minRating": 1650
}, {
    "color": "rgb(27, 199, 224)",
    "maxRating": 1650,
    "minRating": 1450
}, {
    "color": "rgb(89, 206, 26)",
    "maxRating": 1450,
    "minRating": 0
}];
self.USER_CONSTANTS = {
    "first_name_max_length": 30,
    "last_name_max_length": 30,
    "username_max_length": 30,
    "username_regexes": [{
        "pattern": "^((?![_.]{2,}).)*$",
        "message": "Enter a valid username. This value may contain at most one consecutive separator( . or _ characters)."
    }, {
        "pattern": "^[\\w.]+$",
        "message": "Enter a valid username. This value may contain only letters,numbers and separators ( . or _ characters)."
    }, {
        "pattern": "^[^._]",
        "message": "Enter a valid username. This value may not start with a separator ( . or _ characters)."
    }, {
        "pattern": "[^._]$",
        "message": "Enter a valid username. This value may not end with a separator ( . or _ characters)."
    }]
};
self.PUBLIC_STATE = {
    "SocialApp": [{
        "id": 2,
        "name": "Facebook",
        "clientId": "375510855971020",
        "key": ""
    }, {
        "id": 1,
        "name": "Google",
        "clientId": "469601560740-qk0ngdqb8fl07thec3jq9cpjt4k7ver2.apps.googleusercontent.com",
        "key": ""
    }],
    "Language": [{
        "id": 1,
        "name": "English",
        "localName": "English",
        "isoCode": "eng"
    }, {
        "id": 2,
        "name": "Russian",
        "localName": "\u0420\u0443\u0441\u0441\u043a\u0438\u0439",
        "isoCode": "rus"
    }, {
        "id": 3,
        "name": "Mandarin Chinese",
        "localName": "\u5b98\u8a71",
        "isoCode": "cmn"
    }, {
        "id": 4,
        "name": "Romanian",
        "localName": "Rom\u00e2n\u0103",
        "isoCode": "rom"
    }, {
        "id": 5,
        "name": "Arabic",
        "localName": "\u0627\u0644\u0639\u0631\u0628\u064a\u0629",
        "isoCode": "ara"
    }, {
        "id": 6,
        "name": "Spanish",
        "localName": "Espa\u00f1ol",
        "isoCode": "spa"
    }, {
        "id": 7,
        "name": "Japanese",
        "localName": "\u65e5\u672c\u8a9e",
        "isoCode": "jpn"
    }, {
        "id": 8,
        "name": "French",
        "localName": "Fran\u00e7ais",
        "isoCode": "fra"
    }, {
        "id": 9,
        "name": "German",
        "localName": "Deutsch",
        "isoCode": "deu"
    }],
    "TranslationEntry": [{
        "id": 1,
        "translationKeyId": 3,
        "languageId": 2,
        "value": "\u041e\u0433\u0440\u0430\u043d\u0438\u0447\u0435\u043d\u0438\u0435 \u043f\u043e \u0432\u0440\u0435\u043c\u0435\u043d\u0438:"
    }, {
        "id": 2,
        "translationKeyId": 4,
        "languageId": 2,
        "value": "\u041e\u0433\u0440\u0430\u043d\u0438\u0447\u0435\u043d\u0438\u0435 \u043f\u043e \u043f\u0430\u043c\u044f\u0442\u0438:"
    }, {
        "id": 3,
        "translationKeyId": 9,
        "languageId": 2,
        "value": "\u0412\u0432\u043e\u0434"
    }, {
        "id": 4,
        "translationKeyId": 10,
        "languageId": 2,
        "value": "\u0412\u044b\u0432\u043e\u0434"
    }, {
        "id": 5,
        "translationKeyId": 5,
        "languageId": 2,
        "value": "\u0421\u043b\u043e\u0436\u0435\u043d\u0438\u0435"
    }, {
        "id": 8,
        "translationKeyId": 9,
        "languageId": 4,
        "value": "Intrare"
    }, {
        "id": 9,
        "translationKeyId": 8,
        "languageId": 4,
        "value": "Clasament"
    }, {
        "id": 10,
        "translationKeyId": 7,
        "languageId": 4,
        "value": "Concursuri viitoare"
    }, {
        "id": 11,
        "translationKeyId": 6,
        "languageId": 4,
        "value": "Ultimele intr\u0103ri \u00een blog"
    }, {
        "id": 12,
        "translationKeyId": 2,
        "languageId": 4,
        "value": "Compilez\u0103"
    }, {
        "id": 15,
        "translationKeyId": 5,
        "languageId": 4,
        "value": "Adunare"
    }, {
        "id": 7,
        "translationKeyId": 10,
        "languageId": 4,
        "value": "Ie\u0219ire"
    }, {
        "id": 14,
        "translationKeyId": 4,
        "languageId": 4,
        "value": "Limit\u0103 de memorie:"
    }, {
        "id": 13,
        "translationKeyId": 3,
        "languageId": 4,
        "value": "Limit\u0103 de timp:"
    }, {
        "id": 17,
        "translationKeyId": 11,
        "languageId": 2,
        "value": "\u0423\u043f\u043e\u0440\u044f\u0434\u043e\u0447\u0438\u0432\u0430\u043d\u0438\u0435 \u0441\u043b\u043e\u0432"
    }, {
        "id": 18,
        "translationKeyId": 12,
        "languageId": 2,
        "value": "\u0420\u0430\u0437\u0431\u0438\u0435\u043d\u0438\u0435 \u0441\u043e\u0440\u0442\u0438\u0440\u043e\u0432\u043a\u0438"
    }, {
        "id": 19,
        "translationKeyId": 13,
        "languageId": 2,
        "value": "\u041d\u0435\u0447\u0435\u0441\u0442\u043d\u0430\u044f \u0438\u0433\u0440\u0430"
    }, {
        "id": 20,
        "translationKeyId": 14,
        "languageId": 2,
        "value": "\u041f\u0435\u0440\u0435\u0441\u0442\u0430\u043d\u043e\u0432\u043a\u0430 \u0438\u0437 \u043e\u0431\u043c\u0435\u043d\u043e\u0432"
    }, {
        "id": 21,
        "translationKeyId": 15,
        "languageId": 2,
        "value": "\u0420\u0430\u0437\u043d\u043e\u0446\u0432\u0435\u0442\u043d\u044b\u0435 \u043a\u0430\u043c\u0443\u0448\u043a\u0438"
    }, {
        "id": 22,
        "translationKeyId": 16,
        "languageId": 2,
        "value": "\u041f\u043b\u0430\u0442\u0444\u043e\u0440\u043c\u044b"
    }, {
        "id": 23,
        "translationKeyId": 17,
        "languageId": 2,
        "value": "\u0414\u0432\u0435 \u043f\u0440\u043e\u0433\u0440\u0435\u0441\u0441\u0438\u0438"
    }, {
        "id": 24,
        "translationKeyId": 18,
        "languageId": 2,
        "value": "\u0418\u0441\u043a\u043b\u044e\u0447\u0435\u043d\u0438\u0435 \u0447\u0438\u0441\u0435\u043b"
    }, {
        "id": 25,
        "translationKeyId": 19,
        "languageId": 2,
        "value": "\u041f\u0435\u0440\u0435\u0441\u0442\u0430\u043d\u043e\u0432\u043a\u0430 \u0441\u043b\u043e\u0432"
    }, {
        "id": 26,
        "translationKeyId": 20,
        "languageId": 2,
        "value": "\u041d\u041e\u0414 \u043e\u043d\u043b\u0430\u0439\u043d"
    }, {
        "id": 27,
        "translationKeyId": 21,
        "languageId": 2,
        "value": "\u0426\u0438\u043a\u043b\u0438\u0447\u0435\u0441\u043a\u0438\u0435 \u043f\u043e\u0434\u043c\u0430\u0441\u0441\u0438\u0432\u044b"
    }, {
        "id": 28,
        "translationKeyId": 22,
        "languageId": 2,
        "value": "\u041b\u0430\u043c\u043f\u043e\u0447\u043a\u0438"
    }, {
        "id": 29,
        "translationKeyId": 23,
        "languageId": 2,
        "value": "\u0420\u0430\u0441\u043a\u0440\u0430\u0441\u043a\u0430 \u043c\u0430\u0442\u0440\u0438\u0446\u044b"
    }, {
        "id": 30,
        "translationKeyId": 24,
        "languageId": 2,
        "value": "\u0418\u0433\u0440\u0430 \u043d\u0430 \u0434\u0435\u0440\u0435\u0432\u0435"
    }, {
        "id": 31,
        "translationKeyId": 15,
        "languageId": 4,
        "value": "Bile colorate"
    }, {
        "id": 34,
        "translationKeyId": 22,
        "languageId": 4,
        "value": "Becuri"
    }, {
        "id": 38,
        "translationKeyId": 90,
        "languageId": 4,
        "value": "\u00cencarc\u0103 \u00een workspace"
    }, {
        "id": 39,
        "translationKeyId": 89,
        "languageId": 4,
        "value": "Editeaz\u0103 templateul pentru"
    }, {
        "id": 40,
        "translationKeyId": 96,
        "languageId": 4,
        "value": "Execu\u021bie"
    }, {
        "id": 43,
        "translationKeyId": 88,
        "languageId": 4,
        "value": "Se salveaz\u0103..."
    }, {
        "id": 44,
        "translationKeyId": 87,
        "languageId": 4,
        "value": "Compilare"
    }, {
        "id": 45,
        "translationKeyId": 84,
        "languageId": 4,
        "value": "Dimensiune font cod"
    }, {
        "id": 46,
        "translationKeyId": 83,
        "languageId": 4,
        "value": "Memorie folosit\u0103"
    }, {
        "id": 47,
        "translationKeyId": 82,
        "languageId": 4,
        "value": "Mul\u021bumim!"
    }, {
        "id": 48,
        "translationKeyId": 81,
        "languageId": 4,
        "value": "Set\u0103ri"
    }, {
        "id": 49,
        "translationKeyId": 80,
        "languageId": 4,
        "value": "Editeaz\u0103"
    }, {
        "id": 50,
        "translationKeyId": 78,
        "languageId": 4,
        "value": "Nu sunt concursuri viitoare"
    }, {
        "id": 51,
        "translationKeyId": 77,
        "languageId": 4,
        "value": "\u0218terge"
    }, {
        "id": 52,
        "translationKeyId": 75,
        "languageId": 4,
        "value": "Chat Global"
    }, {
        "id": 53,
        "translationKeyId": 74,
        "languageId": 4,
        "value": "Dimensiune font fi\u0219iere"
    }, {
        "id": 54,
        "translationKeyId": 73,
        "languageId": 4,
        "value": "Timp procesor:"
    }, {
        "id": 55,
        "translationKeyId": 69,
        "languageId": 4,
        "value": "Mesaje de compilare"
    }, {
        "id": 56,
        "translationKeyId": 68,
        "languageId": 4,
        "value": "Exemple"
    }, {
        "id": 57,
        "translationKeyId": 66,
        "languageId": 4,
        "value": "Execut\u0103 pe datele mele"
    }, {
        "id": 58,
        "translationKeyId": 65,
        "languageId": 4,
        "value": "Se \u00eencarc\u0103 chatul"
    }, {
        "id": 59,
        "translationKeyId": 62,
        "languageId": 4,
        "value": "\u00cenc\u0103rcare reu\u0219it\u0103!"
    }, {
        "id": 60,
        "translationKeyId": 61,
        "languageId": 4,
        "value": "Salvat"
    }, {
        "id": 61,
        "translationKeyId": 60,
        "languageId": 4,
        "value": "Anuleaz\u0103"
    }, {
        "id": 62,
        "translationKeyId": 59,
        "languageId": 4,
        "value": "Vezi tot clasamentul"
    }, {
        "id": 63,
        "translationKeyId": 57,
        "languageId": 4,
        "value": "Schimb\u0103ri nesalvate"
    }, {
        "id": 64,
        "translationKeyId": 56,
        "languageId": 4,
        "value": "Execut\u0103 pe exemple"
    }, {
        "id": 65,
        "translationKeyId": 55,
        "languageId": 4,
        "value": "Deschide fi\u0219ier"
    }, {
        "id": 66,
        "translationKeyId": 53,
        "languageId": 4,
        "value": "Dimensiune tab"
    }, {
        "id": 67,
        "translationKeyId": 51,
        "languageId": 4,
        "value": "Trimite"
    }, {
        "id": 68,
        "translationKeyId": 34,
        "languageId": 4,
        "value": "Deschide problema \u00een arhiv\u0103"
    }, {
        "id": 32,
        "translationKeyId": 16,
        "languageId": 4,
        "value": "Platforme"
    }, {
        "id": 77,
        "translationKeyId": 38,
        "languageId": 4,
        "value": "Problema"
    }, {
        "id": 78,
        "translationKeyId": 39,
        "languageId": 4,
        "value": "Rezultate"
    }, {
        "id": 79,
        "translationKeyId": 93,
        "languageId": 4,
        "value": "Arat\u0103 num\u0103rul liniei"
    }, {
        "id": 80,
        "translationKeyId": 72,
        "languageId": 4,
        "value": "\u00cencerc\u0103ri"
    }, {
        "id": 82,
        "translationKeyId": 49,
        "languageId": 4,
        "value": "Tot ecranul"
    }, {
        "id": 83,
        "translationKeyId": 45,
        "languageId": 4,
        "value": "\u00cenchide"
    }, {
        "id": 84,
        "translationKeyId": 46,
        "languageId": 4,
        "value": "Pune \u00eentrebare"
    }, {
        "id": 85,
        "translationKeyId": 47,
        "languageId": 4,
        "value": "Discu\u021bie problem\u0103"
    }, {
        "id": 86,
        "translationKeyId": 48,
        "languageId": 4,
        "value": "Cod surs\u0103:"
    }, {
        "id": 87,
        "translationKeyId": 44,
        "languageId": 4,
        "value": "Salveaz\u0103 schimbarile"
    }, {
        "id": 89,
        "translationKeyId": 43,
        "languageId": 4,
        "value": "Memorie folosit\u0103:"
    }, {
        "id": 90,
        "translationKeyId": 40,
        "languageId": 4,
        "value": "Descarc\u0103 sursa"
    }, {
        "id": 91,
        "translationKeyId": 36,
        "languageId": 4,
        "value": "Spune-ne ce crezi!"
    }, {
        "id": 69,
        "translationKeyId": 32,
        "languageId": 4,
        "value": "Explica\u021bie"
    }, {
        "id": 70,
        "translationKeyId": 31,
        "languageId": 4,
        "value": "Tem\u0103"
    }, {
        "id": 71,
        "translationKeyId": 30,
        "languageId": 4,
        "value": "Trimite feedback"
    }, {
        "id": 72,
        "translationKeyId": 29,
        "languageId": 4,
        "value": "Vezi toate concursurile"
    }, {
        "id": 73,
        "translationKeyId": 26,
        "languageId": 4,
        "value": "Enun\u021b"
    }, {
        "id": 108,
        "translationKeyId": 2,
        "languageId": 2,
        "value": "\u041a\u043e\u043c\u043f\u0438\u043b\u0438\u0440\u043e\u0432\u0430\u0442\u044c"
    }, {
        "id": 93,
        "translationKeyId": 37,
        "languageId": 4,
        "value": "Limbaj preferat:"
    }, {
        "id": 94,
        "translationKeyId": 41,
        "languageId": 4,
        "value": "Salveaz\u0103 \u0219ablon pentru"
    }, {
        "id": 95,
        "translationKeyId": 58,
        "languageId": 4,
        "value": "Aplic\u0103 filtru"
    }, {
        "id": 96,
        "translationKeyId": 67,
        "languageId": 4,
        "value": "Se \u00eencarc\u0103"
    }, {
        "id": 97,
        "translationKeyId": 70,
        "languageId": 4,
        "value": "Trimite \u00een arhiv\u0103"
    }, {
        "id": 98,
        "translationKeyId": 71,
        "languageId": 4,
        "value": "Rezumat"
    }, {
        "id": 99,
        "translationKeyId": 76,
        "languageId": 4,
        "value": "Semnal de terminare"
    }, {
        "id": 100,
        "translationKeyId": 95,
        "languageId": 4,
        "value": "Articol"
    }, {
        "id": 101,
        "translationKeyId": 97,
        "languageId": 4,
        "value": "Cod terminare"
    }, {
        "id": 102,
        "translationKeyId": 42,
        "languageId": 4,
        "value": "Limb\u0103:"
    }, {
        "id": 103,
        "translationKeyId": 17,
        "languageId": 4,
        "value": "Dou\u0103 progresii"
    }, {
        "id": 104,
        "translationKeyId": 20,
        "languageId": 4,
        "value": "Cmmdc online"
    }, {
        "id": 105,
        "translationKeyId": 52,
        "languageId": 4,
        "value": "Submisie"
    }, {
        "id": 107,
        "translationKeyId": 1,
        "languageId": 2,
        "value": "\u0417\u0430\u043f\u0443\u0441\u0442\u0438\u0442\u044c"
    }, {
        "id": 109,
        "translationKeyId": 6,
        "languageId": 2,
        "value": "\u041f\u043e\u0441\u043b\u0435\u0434\u043d\u0438\u0435 \u0437\u0430\u043f\u0438\u0441\u0438 \u0432 \u0431\u043b\u043e\u0433\u0435"
    }, {
        "id": 110,
        "translationKeyId": 7,
        "languageId": 2,
        "value": "\u041f\u0440\u0435\u0434\u0441\u0442\u043e\u044f\u0449\u0438\u0435 \u0441\u043e\u0440\u0435\u0432\u043d\u043e\u0432\u0430\u043d\u0438\u044f"
    }, {
        "id": 113,
        "translationKeyId": 26,
        "languageId": 2,
        "value": "\u0423\u0441\u043b\u043e\u0432\u0438\u0435"
    }, {
        "id": 114,
        "translationKeyId": 27,
        "languageId": 2,
        "value": "\u041e\u0431\u0440\u0430\u0442\u043d\u0430\u044f \u0441\u0432\u044f\u0437\u044c"
    }, {
        "id": 116,
        "translationKeyId": 28,
        "languageId": 2,
        "value": "\u0420\u0435\u0436\u0438\u043c \u0440\u0430\u0437\u0434\u0435\u043b\u0435\u043d\u0438\u044f"
    }, {
        "id": 117,
        "translationKeyId": 29,
        "languageId": 2,
        "value": "\u0421\u043f\u0438\u0441\u043e\u043a \u0441\u043e\u0440\u0435\u0432\u043d\u043e\u0432\u0430\u043d\u0438\u0439"
    }, {
        "id": 118,
        "translationKeyId": 30,
        "languageId": 2,
        "value": "\u041e\u0442\u043f\u0440\u0430\u0432\u0438\u0442\u044c"
    }, {
        "id": 119,
        "translationKeyId": 31,
        "languageId": 2,
        "value": "\u0422\u0435\u043c\u0430"
    }, {
        "id": 121,
        "translationKeyId": 34,
        "languageId": 2,
        "value": "\u041e\u0442\u043a\u0440\u044b\u0442\u044c \u0437\u0430\u0434\u0430\u0447\u0443 \u0432 \u0430\u0440\u0445\u0438\u0432\u0435 \u0437\u0430\u0434\u0430\u0447"
    }, {
        "id": 122,
        "translationKeyId": 35,
        "languageId": 2,
        "value": "\u0420\u0435\u0434\u0430\u043a\u0442\u043e\u0440"
    }, {
        "id": 123,
        "translationKeyId": 36,
        "languageId": 2,
        "value": "\u041e\u0441\u0442\u0430\u0432\u044c\u0442\u0435 \u0441\u0432\u043e\u0451 \u043c\u043d\u0435\u043d\u0438\u0435 \u043e \u043d\u0430\u0448\u0435\u043c \u0441\u0430\u0439\u0442\u0435!"
    }, {
        "id": 124,
        "translationKeyId": 37,
        "languageId": 2,
        "value": "\u041f\u0440\u0435\u0434\u043f\u043e\u0447\u0442\u0438\u0442\u0435\u043b\u044c\u043d\u044b\u0439 \u044f\u0437\u044b\u043a \u043f\u0440\u043e\u0433\u0440\u0430\u043c\u043c\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u044f:"
    }, {
        "id": 125,
        "translationKeyId": 38,
        "languageId": 2,
        "value": "\u0417\u0430\u0434\u0430\u0447\u0430"
    }, {
        "id": 126,
        "translationKeyId": 39,
        "languageId": 2,
        "value": "\u0420\u0435\u0437\u0443\u043b\u044c\u0442\u0430\u0442\u044b"
    }, {
        "id": 127,
        "translationKeyId": 40,
        "languageId": 2,
        "value": "\u0421\u043a\u0430\u0447\u0430\u0442\u044c \u0438\u0441\u0445\u043e\u0434\u043d\u044b\u0439 \u043a\u043e\u0434"
    }, {
        "id": 129,
        "translationKeyId": 41,
        "languageId": 2,
        "value": "\u0421\u043e\u0445\u0440\u0430\u043d\u0438\u0442\u044c \u0448\u0430\u0431\u043b\u043e\u043d \u0434\u043b\u044f"
    }, {
        "id": 130,
        "translationKeyId": 42,
        "languageId": 2,
        "value": "\u042f\u0437\u044b\u043a:"
    }, {
        "id": 131,
        "translationKeyId": 43,
        "languageId": 2,
        "value": "\u0418\u0441\u043f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u043d\u0438\u0435 \u043f\u0430\u043c\u044f\u0442\u0438:"
    }, {
        "id": 132,
        "translationKeyId": 44,
        "languageId": 2,
        "value": "\u0421\u043e\u0445\u0440\u0430\u043d\u0438\u0442\u044c \u0438\u0437\u043c\u0435\u043d\u0435\u043d\u0438\u044f"
    }, {
        "id": 133,
        "translationKeyId": 45,
        "languageId": 2,
        "value": "\u0417\u0430\u043a\u0440\u044b\u0442\u044c"
    }, {
        "id": 134,
        "translationKeyId": 46,
        "languageId": 2,
        "value": "\u0417\u0430\u0434\u0430\u0442\u044c \u0432\u043e\u043f\u0440\u043e\u0441"
    }, {
        "id": 135,
        "translationKeyId": 47,
        "languageId": 2,
        "value": "\u041e\u0431\u0441\u0443\u0436\u0434\u0435\u043d\u0438\u0435 \u0437\u0430\u0434\u0430\u0447\u0438"
    }, {
        "id": 136,
        "translationKeyId": 48,
        "languageId": 2,
        "value": "\u0418\u0441\u0445\u043e\u0434\u043d\u044b\u0439 \u043a\u043e\u0434:"
    }, {
        "id": 137,
        "translationKeyId": 49,
        "languageId": 2,
        "value": "\u041f\u043e\u043b\u043d\u043e\u044d\u043a\u0440\u0430\u043d\u043d\u044b\u0439 \u0440\u0435\u0436\u0438\u043c"
    }, {
        "id": 111,
        "translationKeyId": 8,
        "languageId": 2,
        "value": "\u041b\u0438\u0434\u0435\u0440\u044b"
    }, {
        "id": 112,
        "translationKeyId": 25,
        "languageId": 2,
        "value": "\u041e\u0442\u043a\u0443\u0434\u0430"
    }, {
        "id": 74,
        "translationKeyId": 25,
        "languageId": 4,
        "value": "Concurs"
    }, {
        "id": 6,
        "translationKeyId": 1,
        "languageId": 4,
        "value": "Ruleaz\u0103"
    }, {
        "id": 92,
        "translationKeyId": 27,
        "languageId": 4,
        "value": "Opinia ta"
    }, {
        "id": 138,
        "translationKeyId": 51,
        "languageId": 2,
        "value": "\u041e\u0442\u043f\u0440\u0430\u0432\u0438\u0442\u044c"
    }, {
        "id": 139,
        "translationKeyId": 52,
        "languageId": 2,
        "value": "\u041f\u043e\u0441\u044b\u043b\u043a\u0430"
    }, {
        "id": 140,
        "translationKeyId": 53,
        "languageId": 2,
        "value": "\u0420\u0430\u0437\u043c\u0435\u0440 \u043e\u0442\u0441\u0442\u0443\u043f\u0430"
    }, {
        "id": 141,
        "translationKeyId": 54,
        "languageId": 2,
        "value": "\u041d\u0430\u0441\u0442\u0440\u043e\u0439\u043a\u0438 \u0440\u0435\u0434\u0430\u043a\u0442\u043e\u0440\u0430"
    }, {
        "id": 267,
        "translationKeyId": 30,
        "languageId": 5,
        "value": "\u0631\u0633\u0627\u0644"
    }, {
        "id": 144,
        "translationKeyId": 57,
        "languageId": 2,
        "value": "\u041d\u0435\u0441\u043e\u0445\u0440\u0430\u043d\u0451\u043d\u043d\u044b\u0435 \u0438\u0437\u043c\u0435\u043d\u0435\u043d\u0438\u044f"
    }, {
        "id": 145,
        "translationKeyId": 58,
        "languageId": 2,
        "value": "\u041f\u0440\u0438\u043c\u0435\u043d\u0438\u0442\u044c \u0444\u0438\u043b\u044c\u0442\u0440"
    }, {
        "id": 147,
        "translationKeyId": 60,
        "languageId": 2,
        "value": "\u041e\u0442\u043c\u0435\u043d\u0430"
    }, {
        "id": 148,
        "translationKeyId": 61,
        "languageId": 2,
        "value": "\u0421\u043e\u0445\u0440\u0430\u043d\u0435\u043d\u043e"
    }, {
        "id": 149,
        "translationKeyId": 62,
        "languageId": 2,
        "value": "\u0417\u0430\u0433\u0440\u0443\u0436\u0435\u043d\u043e \u0443\u0441\u043f\u0435\u0448\u043d\u043e!"
    }, {
        "id": 150,
        "translationKeyId": 63,
        "languageId": 2,
        "value": "\u041f\u0440\u043e\u0446\u0435\u0441\u0441\u043e\u0440\u043d\u043e\u0435 \u0432\u0440\u0435\u043c\u044f"
    }, {
        "id": 151,
        "translationKeyId": 64,
        "languageId": 2,
        "value": "\u041f\u043e\u043a\u0430\u0437\u044b\u0432\u0430\u0442\u044c \u0433\u0440\u0430\u043d\u0438\u0446\u0443 \u043f\u0435\u0447\u0430\u0442\u0438"
    }, {
        "id": 152,
        "translationKeyId": 65,
        "languageId": 2,
        "value": "\u0427\u0430\u0442 \u0437\u0430\u0433\u0440\u0443\u0436\u0430\u0435\u0442\u0441\u044f..."
    }, {
        "id": 154,
        "translationKeyId": 67,
        "languageId": 2,
        "value": "\u0417\u0430\u0433\u0440\u0443\u0437\u043a\u0430..."
    }, {
        "id": 155,
        "translationKeyId": 68,
        "languageId": 2,
        "value": "\u041f\u0440\u0438\u043c\u0435\u0440\u044b"
    }, {
        "id": 156,
        "translationKeyId": 69,
        "languageId": 2,
        "value": "\u0421\u043e\u043e\u0431\u0449\u0435\u043d\u0438\u044f \u043a\u043e\u043c\u043f\u0438\u043b\u044f\u0442\u043e\u0440\u0430"
    }, {
        "id": 157,
        "translationKeyId": 70,
        "languageId": 2,
        "value": "\u041e\u0442\u043f\u0440\u0430\u0432\u0438\u0442\u044c \u0432 \u0430\u0440\u0445\u0438\u0432 \u0437\u0430\u0434\u0430\u0447"
    }, {
        "id": 159,
        "translationKeyId": 73,
        "languageId": 2,
        "value": "\u041f\u0440\u043e\u0446\u0435\u0441\u0441\u043e\u0440\u043d\u043e\u0435 \u0432\u0440\u0435\u043c\u044f:"
    }, {
        "id": 160,
        "translationKeyId": 75,
        "languageId": 2,
        "value": "\u0413\u043b\u043e\u0431\u0430\u043b\u044c\u043d\u044b\u0439 \u0447\u0430\u0442"
    }, {
        "id": 161,
        "translationKeyId": 76,
        "languageId": 2,
        "value": "\u0421\u0438\u0433\u043d\u0430\u043b \u043e\u0448\u0438\u0431\u043a\u0438"
    }, {
        "id": 162,
        "translationKeyId": 77,
        "languageId": 2,
        "value": "\u0423\u0434\u0430\u043b\u0438\u0442\u044c"
    }, {
        "id": 163,
        "translationKeyId": 78,
        "languageId": 2,
        "value": "\u041d\u0435\u0442 \u0437\u0430\u043f\u043b\u0430\u043d\u0438\u0440\u043e\u0432\u0430\u043d\u043d\u044b\u0445 \u043a\u043e\u043d\u0442\u0435\u0441\u0442\u043e\u0432."
    }, {
        "id": 164,
        "translationKeyId": 79,
        "languageId": 2,
        "value": "\u0413\u0440\u0430\u043d\u0438\u0446\u0430 \u043f\u0435\u0447\u0430\u0442\u0438"
    }, {
        "id": 165,
        "translationKeyId": 80,
        "languageId": 2,
        "value": "\u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u0442\u044c"
    }, {
        "id": 166,
        "translationKeyId": 81,
        "languageId": 2,
        "value": "\u041d\u0430\u0441\u0442\u0440\u043e\u0439\u043a\u0438"
    }, {
        "id": 167,
        "translationKeyId": 82,
        "languageId": 2,
        "value": "\u0421\u043f\u0430\u0441\u0438\u0431\u043e \u0437\u0430 \u0412\u0430\u0448\u0435 \u043c\u043d\u0435\u043d\u0438\u0435!"
    }, {
        "id": 143,
        "translationKeyId": 56,
        "languageId": 2,
        "value": "\u0417\u0430\u043f\u0443\u0441\u043a \u043d\u0430 \u043f\u0440\u0438\u043c\u0435\u0440\u0430\u0445"
    }, {
        "id": 172,
        "translationKeyId": 83,
        "languageId": 2,
        "value": "\u0418\u0441\u043f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u043d\u0438\u0435 \u043f\u0430\u043c\u044f\u0442\u0438"
    }, {
        "id": 173,
        "translationKeyId": 84,
        "languageId": 2,
        "value": "\u0420\u0430\u0437\u043c\u0435\u0440 \u0448\u0440\u0438\u0444\u0442\u0430 \u043a\u043e\u0434\u0430"
    }, {
        "id": 174,
        "translationKeyId": 85,
        "languageId": 2,
        "value": "\u041f\u0440\u0435\u0434\u043f\u0440\u043e\u0441\u043c\u043e\u0442\u0440"
    }, {
        "id": 175,
        "translationKeyId": 86,
        "languageId": 2,
        "value": "\u0420\u0435\u0434\u0430\u043a\u0442\u043e\u0440 \u043a\u043e\u0434\u0430"
    }, {
        "id": 176,
        "translationKeyId": 87,
        "languageId": 2,
        "value": "\u041a\u043e\u043c\u043f\u0438\u043b\u044f\u0446\u0438\u044f"
    }, {
        "id": 177,
        "translationKeyId": 88,
        "languageId": 2,
        "value": "\u0421\u043e\u0445\u0440\u0430\u043d\u044f\u044e..."
    }, {
        "id": 178,
        "translationKeyId": 89,
        "languageId": 2,
        "value": "\u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u0442\u044c \u0448\u0430\u0431\u043b\u043e\u043d \u0434\u043b\u044f"
    }, {
        "id": 179,
        "translationKeyId": 90,
        "languageId": 2,
        "value": "\u0417\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044c \u0432 \u0440\u0435\u0434\u0430\u043a\u0442\u043e\u0440 \u043a\u043e\u0434\u0430"
    }, {
        "id": 180,
        "translationKeyId": 92,
        "languageId": 2,
        "value": "Stderr"
    }, {
        "id": 181,
        "translationKeyId": 93,
        "languageId": 2,
        "value": "\u041d\u0443\u043c\u0435\u0440\u043e\u0432\u0430\u0442\u044c \u0441\u0442\u0440\u043e\u043a\u0438"
    }, {
        "id": 182,
        "translationKeyId": 95,
        "languageId": 2,
        "value": "\u0421\u0442\u0430\u0442\u044c\u044f"
    }, {
        "id": 183,
        "translationKeyId": 96,
        "languageId": 2,
        "value": "\u0412\u044b\u043f\u043e\u043b\u043d\u0435\u043d\u0438\u0435"
    }, {
        "id": 185,
        "translationKeyId": 97,
        "languageId": 2,
        "value": "\u041a\u043e\u0434 \u0432\u043e\u0437\u0432\u0440\u0430\u0442\u0430"
    }, {
        "id": 120,
        "translationKeyId": 32,
        "languageId": 2,
        "value": "\u041f\u043e\u044f\u0441\u043d\u0435\u043d\u0438\u0435"
    }, {
        "id": 186,
        "translationKeyId": 33,
        "languageId": 2,
        "value": "\u041e\u043d\u043b\u0430\u0439\u043d:"
    }, {
        "id": 188,
        "translationKeyId": 71,
        "languageId": 2,
        "value": "\u041e\u0431\u0449\u0430\u044f \u0438\u043d\u0444\u043e\u0440\u043c\u0430\u0446\u0438\u044f"
    }, {
        "id": 189,
        "translationKeyId": 74,
        "languageId": 2,
        "value": "\u0420\u0430\u0437\u043c\u0435\u0440 \u0448\u0440\u0438\u0444\u0442\u0430 \u0444\u0430\u0439\u043b\u043e\u0432"
    }, {
        "id": 190,
        "translationKeyId": 91,
        "languageId": 2,
        "value": "\u0417\u0430\u0434\u0430\u0442\u044c \u0432\u0432\u043e\u0434"
    }, {
        "id": 191,
        "translationKeyId": 94,
        "languageId": 2,
        "value": "\u041e\u0431\u043c\u0435\u043d\u044f\u0442\u044c"
    }, {
        "id": 187,
        "translationKeyId": 50,
        "languageId": 2,
        "value": "\u0424\u0438\u043b\u044c\u0442\u0440\u043e\u0432\u0430\u0442\u044c \u043f\u043e\u0441\u044b\u043b\u043a\u0438"
    }, {
        "id": 146,
        "translationKeyId": 59,
        "languageId": 2,
        "value": "\u041f\u043e\u043b\u043d\u044b\u0439 \u0441\u043f\u0438\u0441\u043e\u043a"
    }, {
        "id": 158,
        "translationKeyId": 72,
        "languageId": 2,
        "value": "\u041f\u043e\u0441\u044b\u043b\u043a\u0438"
    }, {
        "id": 192,
        "translationKeyId": 98,
        "languageId": 2,
        "value": "\u041c\u0438\u043d\u0438\u041c\u0430\u043a\u0441 \u043f\u043e\u0434\u043c\u0430\u0441\u0441\u0438\u0432"
    }, {
        "id": 193,
        "translationKeyId": 99,
        "languageId": 2,
        "value": "\u041a\u043b\u0438\u043a\u0430 \u0434\u0435\u043b\u0438\u0442\u0435\u043b\u0435\u0439"
    }, {
        "id": 194,
        "translationKeyId": 100,
        "languageId": 2,
        "value": "\u0414\u0432\u0438\u0436\u0443\u0449\u0438\u0435\u0441\u044f \u043e\u0442\u0440\u0435\u0437\u043a\u0438"
    }, {
        "id": 195,
        "translationKeyId": 101,
        "languageId": 2,
        "value": "A-\u0438\u0433\u0440\u0430"
    }, {
        "id": 196,
        "translationKeyId": 102,
        "languageId": 2,
        "value": "\u041e\u0431\u043c\u0435\u043d\u044b \u043d\u0430 \u0434\u0435\u0440\u0435\u0432\u0435"
    }, {
        "id": 197,
        "translationKeyId": 103,
        "languageId": 2,
        "value": "\u0410\u043d\u0430\u0433\u0440\u0430\u043c\u043c\u044b"
    }, {
        "id": 198,
        "translationKeyId": 104,
        "languageId": 2,
        "value": "\u041d\u0435\u0447\u0435\u0442\u043d\u044b\u0435 \u0434\u0435\u043b\u0438\u0442\u0435\u043b\u0438"
    }, {
        "id": 199,
        "translationKeyId": 105,
        "languageId": 2,
        "value": "\u0413\u0440\u0443\u043f\u043f\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435 \u043e\u0431\u043c\u0435\u043d\u0430\u043c\u0438"
    }, {
        "id": 200,
        "translationKeyId": 106,
        "languageId": 2,
        "value": "\u041a\u043d\u0438\u0433\u0430 \u0432 \u0431\u0438\u0431\u043b\u0438\u043e\u0442\u0435\u043a\u0435"
    }, {
        "id": 201,
        "translationKeyId": 108,
        "languageId": 2,
        "value": "\u0421\u043e\u043b\u0434\u0430\u0442\u044b"
    }, {
        "id": 202,
        "translationKeyId": 107,
        "languageId": 2,
        "value": "\u041c\u0430\u043a\u0441\u0438\u043c\u0430\u043b\u044c\u043d\u044b\u0439 xor \u043e\u043d\u043b\u0430\u0439\u043d"
    }, {
        "id": 142,
        "translationKeyId": 55,
        "languageId": 2,
        "value": "\u0418\u0437 \u0444\u0430\u0439\u043b\u0430"
    }, {
        "id": 204,
        "translationKeyId": 112,
        "languageId": 4,
        "value": "Concursuri"
    }, {
        "id": 205,
        "translationKeyId": 111,
        "languageId": 4,
        "value": "Aplica\u021bii"
    }, {
        "id": 206,
        "translationKeyId": 110,
        "languageId": 4,
        "value": "Lec\u021bii"
    }, {
        "id": 203,
        "translationKeyId": 109,
        "languageId": 4,
        "value": "Probleme"
    }, {
        "id": 207,
        "translationKeyId": 50,
        "languageId": 4,
        "value": "Filtreaz\u0103 submisii"
    }, {
        "id": 208,
        "translationKeyId": 109,
        "languageId": 2,
        "value": "\u0417\u0430\u0434\u0430\u0447\u0438"
    }, {
        "id": 209,
        "translationKeyId": 110,
        "languageId": 2,
        "value": "\u0423\u0440\u043e\u043a\u0438"
    }, {
        "id": 210,
        "translationKeyId": 111,
        "languageId": 2,
        "value": "\u041f\u0440\u0438\u043b\u043e\u0436\u0435\u043d\u0438\u044f"
    }, {
        "id": 211,
        "translationKeyId": 112,
        "languageId": 2,
        "value": "\u0421\u043e\u0440\u0435\u0432\u043d\u043e\u0432\u0430\u043d\u0438\u044f"
    }, {
        "id": 212,
        "translationKeyId": 113,
        "languageId": 4,
        "value": "Blog"
    }, {
        "id": 213,
        "translationKeyId": 114,
        "languageId": 4,
        "value": "Despre noi"
    }, {
        "id": 214,
        "translationKeyId": 113,
        "languageId": 2,
        "value": "\u0411\u043b\u043e\u0433"
    }, {
        "id": 215,
        "translationKeyId": 114,
        "languageId": 2,
        "value": "\u041e \u043f\u0440\u043e\u0435\u043a\u0442\u0435"
    }, {
        "id": 216,
        "translationKeyId": 115,
        "languageId": 4,
        "value": "Profilul meu"
    }, {
        "id": 217,
        "translationKeyId": 115,
        "languageId": 2,
        "value": "\u041c\u043e\u0439 \u043f\u0440\u043e\u0444\u0438\u043b\u044c"
    }, {
        "id": 218,
        "translationKeyId": 116,
        "languageId": 2,
        "value": "\u041d\u0430\u0441\u0442\u0440\u043e\u0439\u043a\u0438 \u0430\u043a\u043a\u0430\u0443\u043d\u0442\u0430"
    }, {
        "id": 219,
        "translationKeyId": 117,
        "languageId": 2,
        "value": "\u0412\u044b\u0439\u0442\u0438"
    }, {
        "id": 220,
        "translationKeyId": 116,
        "languageId": 4,
        "value": "Set\u0103ri cont"
    }, {
        "id": 221,
        "translationKeyId": 117,
        "languageId": 4,
        "value": "Delogare"
    }, {
        "id": 222,
        "translationKeyId": 118,
        "languageId": 4,
        "value": "Scorul t\u0103u"
    }, {
        "id": 223,
        "translationKeyId": 122,
        "languageId": 4,
        "value": "Rat\u0103 de succes"
    }, {
        "id": 224,
        "translationKeyId": 118,
        "languageId": 2,
        "value": "\u041c\u043e\u0438 \u0431\u0430\u043b\u043b\u044b"
    }, {
        "id": 225,
        "translationKeyId": 119,
        "languageId": 2,
        "value": "\u041f\u043e\u043f\u044b\u0442\u043a\u0430"
    }, {
        "id": 226,
        "translationKeyId": 120,
        "languageId": 2,
        "value": "\u041f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u0442\u0435\u043b\u0435\u0439 \u0440\u0435\u0448\u0438\u043b\u0438"
    }, {
        "id": 227,
        "translationKeyId": 122,
        "languageId": 2,
        "value": "\u041f\u0440\u043e\u0446\u0435\u043d\u0442 \u0443\u0441\u043f\u0435\u0445\u0430"
    }, {
        "id": 228,
        "translationKeyId": 121,
        "languageId": 2,
        "value": "\u041f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u0442\u0435\u043b\u0435\u0439 \u043f\u044b\u0442\u0430\u043b\u0438\u0441\u044c"
    }, {
        "id": 153,
        "translationKeyId": 66,
        "languageId": 2,
        "value": "\u0412\u0430\u0448 \u0432\u0432\u043e\u0434"
    }, {
        "id": 230,
        "translationKeyId": 124,
        "languageId": 2,
        "value": "\u041f\u043e\u043b\u043e\u0436\u0435\u043d\u0438\u0435"
    }, {
        "id": 231,
        "translationKeyId": 125,
        "languageId": 2,
        "value": "\u041e\u0431\u044a\u044f\u0432\u043b\u0435\u043d\u0438\u044f"
    }, {
        "id": 232,
        "translationKeyId": 126,
        "languageId": 2,
        "value": "\u0412\u043e\u043f\u0440\u043e\u0441\u044b"
    }, {
        "id": 243,
        "translationKeyId": 6,
        "languageId": 5,
        "value": "\u0627\u062e\u0631 \u0627\u0644\u0645\u0646\u0634\u0648\u0631\u0627\u062a"
    }, {
        "id": 233,
        "translationKeyId": 127,
        "languageId": 2,
        "value": "\u0427\u0430\u0442"
    }, {
        "id": 234,
        "translationKeyId": 128,
        "languageId": 2,
        "value": "\u041a\u043e\u043c\u043f\u0438\u043b\u044f\u0446\u0438\u044f..."
    }, {
        "id": 235,
        "translationKeyId": 129,
        "languageId": 2,
        "value": "\u0421\u043a\u043e\u043c\u043f\u0438\u043b\u0438\u0440\u043e\u0432\u0430\u043d\u043e"
    }, {
        "id": 236,
        "translationKeyId": 130,
        "languageId": 2,
        "value": "\u0417\u0430\u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0438\u0440\u043e\u0432\u0430\u0442\u044c\u0441\u044f"
    }, {
        "id": 237,
        "translationKeyId": 131,
        "languageId": 2,
        "value": "\u0417\u0430\u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0438\u0440\u043e\u0432\u0430\u043d(\u0430)"
    }, {
        "id": 238,
        "translationKeyId": 1,
        "languageId": 5,
        "value": "\u062a\u0646\u0641\u064a\u0630"
    }, {
        "id": 239,
        "translationKeyId": 2,
        "languageId": 5,
        "value": "\u0628\u0646\u0627\u0621"
    }, {
        "id": 240,
        "translationKeyId": 3,
        "languageId": 5,
        "value": "\u062d\u062f\u0648\u062f \u0627\u0644\u0632\u0645\u0646:"
    }, {
        "id": 241,
        "translationKeyId": 4,
        "languageId": 5,
        "value": "\u062d\u062f\u0648\u062f \u0627\u0644\u0630\u0627\u0643\u0631\u0629:"
    }, {
        "id": 242,
        "translationKeyId": 5,
        "languageId": 5,
        "value": "\u0627\u0644\u062c\u0645\u0639"
    }, {
        "id": 244,
        "translationKeyId": 7,
        "languageId": 5,
        "value": "\u0627\u0644\u0645\u0633\u0627\u0628\u0642\u0627\u062a \u0627\u0644\u0642\u0627\u062f\u0645\u0629"
    }, {
        "id": 246,
        "translationKeyId": 9,
        "languageId": 5,
        "value": "\u0627\u0644\u062f\u062e\u0644"
    }, {
        "id": 247,
        "translationKeyId": 10,
        "languageId": 5,
        "value": "\u0627\u0644\u062e\u0631\u062c"
    }, {
        "id": 248,
        "translationKeyId": 11,
        "languageId": 5,
        "value": "\u062a\u0631\u062a\u064a\u0628 \u0627\u0644\u0643\u0644\u0645\u0627\u062a"
    }, {
        "id": 249,
        "translationKeyId": 12,
        "languageId": 5,
        "value": "\u062a\u0631\u062a\u064a\u0628 \u0627\u0644\u062a\u0642\u0633\u064a\u0645"
    }, {
        "id": 250,
        "translationKeyId": 13,
        "languageId": 5,
        "value": "\u0644\u0639\u0628\u0629 \u063a\u064a\u0631 \u0639\u0627\u062f\u0644\u0629"
    }, {
        "id": 251,
        "translationKeyId": 14,
        "languageId": 5,
        "value": "\u062a\u0628\u062f\u064a\u0644 \u0627\u0644\u062a\u0631\u062a\u064a\u0628"
    }, {
        "id": 252,
        "translationKeyId": 15,
        "languageId": 5,
        "value": "\u0627\u0644\u0643\u0631\u0627\u0629 \u0627\u0644\u0645\u0644\u0648\u0646\u0629"
    }, {
        "id": 253,
        "translationKeyId": 16,
        "languageId": 5,
        "value": "\u0627\u0644\u0645\u0646\u0635\u0627\u062a"
    }, {
        "id": 254,
        "translationKeyId": 17,
        "languageId": 5,
        "value": "\u062a\u0642\u062f\u0645\u0627\u0646"
    }, {
        "id": 255,
        "translationKeyId": 18,
        "languageId": 5,
        "value": "\u0627\u0632\u0627\u0644\u0629 \u0627\u0644\u0623\u0631\u0642\u0627\u0645"
    }, {
        "id": 256,
        "translationKeyId": 19,
        "languageId": 5,
        "value": "\u062a\u0631\u062a\u064a\u0628 \u0627\u0644\u0643\u0644\u0645\u0629"
    }, {
        "id": 257,
        "translationKeyId": 20,
        "languageId": 5,
        "value": "\u0627\u0644\u0642\u0627\u0633\u0645 \u0627\u0644\u0645\u0634\u062a\u0631\u0643 \u0627\u0644\u0623\u0643\u0628\u0631 \u0628\u0637\u0631\u064a\u0642\u0629 \u0623\u0648\u0646\u0644\u0627\u064a\u0646"
    }, {
        "id": 258,
        "translationKeyId": 21,
        "languageId": 5,
        "value": "\u0627\u0644\u0645\u0635\u0641\u0648\u0641\u0627\u062a \u0627\u0644\u062c\u0632\u0626\u064a\u0629 \u0627\u0644\u062f\u0627\u0626\u0631\u064a\u0629"
    }, {
        "id": 245,
        "translationKeyId": 8,
        "languageId": 5,
        "value": "\u0627\u0644\u0645\u062a\u0635\u062f\u0631\u064a\u0646"
    }, {
        "id": 259,
        "translationKeyId": 22,
        "languageId": 5,
        "value": "\u0627\u0644\u0645\u0635\u0627\u0628\u064a\u062d"
    }, {
        "id": 260,
        "translationKeyId": 23,
        "languageId": 5,
        "value": "\u062a\u0644\u0648\u064a\u0646 \u0627\u0644\u0645\u0635\u0641\u0648\u0641\u0627\u062a"
    }, {
        "id": 261,
        "translationKeyId": 24,
        "languageId": 5,
        "value": "\u0644\u0639\u0628\u0629 \u0627\u0644\u0634\u062c\u0631\u0629"
    }, {
        "id": 262,
        "translationKeyId": 25,
        "languageId": 5,
        "value": "\u0627\u0644\u0645\u0635\u062f\u0631"
    }, {
        "id": 263,
        "translationKeyId": 26,
        "languageId": 5,
        "value": "\u0646\u0635 \u0627\u0644\u0645\u0633\u0623\u0644\u0629"
    }, {
        "id": 264,
        "translationKeyId": 27,
        "languageId": 5,
        "value": "\u0627\u0644\u0646\u062a\u064a\u062c\u0629"
    }, {
        "id": 265,
        "translationKeyId": 28,
        "languageId": 5,
        "value": "\u062a\u0642\u0633\u064a\u0645 \u0627\u0644\u0634\u0627\u0634\u0629"
    }, {
        "id": 266,
        "translationKeyId": 29,
        "languageId": 5,
        "value": "\u0627\u0638\u0647\u0627\u0631 \u0642\u0627\u0626\u0645\u0629 \u062c\u0645\u064a\u0639 \u0627\u0644\u0645\u0633\u0627\u0628\u0642\u0627\u062a"
    }, {
        "id": 268,
        "translationKeyId": 31,
        "languageId": 5,
        "value": "\u0645\u0648\u0636\u0648\u0639"
    }, {
        "id": 269,
        "translationKeyId": 32,
        "languageId": 5,
        "value": "\u0634\u0631\u062d"
    }, {
        "id": 270,
        "translationKeyId": 33,
        "languageId": 5,
        "value": "\u0623\u0648\u0646\u0644\u0627\u064a\u0646:"
    }, {
        "id": 271,
        "translationKeyId": 34,
        "languageId": 5,
        "value": "\u0641\u062a\u062d \u0627\u0644\u0645\u0633\u0623\u0644\u0629 \u0645\u0646 \u0623\u0631\u0634\u064a\u0641 \u0627\u0644\u0645\u0633\u0627\u0626\u0644"
    }, {
        "id": 272,
        "translationKeyId": 35,
        "languageId": 5,
        "value": "\u0645\u062d\u0631\u0631"
    }, {
        "id": 273,
        "translationKeyId": 36,
        "languageId": 5,
        "value": "\u0623\u062e\u0628\u0631\u0646\u0627 \u0639\u0646 \u0631\u0623\u064a\u0643!"
    }, {
        "id": 274,
        "translationKeyId": 37,
        "languageId": 5,
        "value": "\u0627\u0644\u0644\u063a\u0629 \u0627\u0644\u0645\u0641\u0636\u0644\u0629:"
    }, {
        "id": 275,
        "translationKeyId": 38,
        "languageId": 5,
        "value": "\u0627\u0644\u0645\u0633\u0623\u0644\u0629"
    }, {
        "id": 276,
        "translationKeyId": 39,
        "languageId": 5,
        "value": "\u0627\u0644\u0646\u062a\u0627\u0626\u062c"
    }, {
        "id": 277,
        "translationKeyId": 40,
        "languageId": 5,
        "value": "\u062a\u062d\u0645\u064a\u0644 \u0627\u0644\u0643\u0648\u062f"
    }, {
        "id": 278,
        "translationKeyId": 41,
        "languageId": 5,
        "value": "\u062d\u0641\u0638 \u0627\u0644\u0642\u0627\u0644\u0628 \u0644\u0623\u062c\u0644"
    }, {
        "id": 279,
        "translationKeyId": 42,
        "languageId": 5,
        "value": "\u0627\u0644\u0644\u063a\u0629:"
    }, {
        "id": 280,
        "translationKeyId": 43,
        "languageId": 5,
        "value": "\u0627\u0644\u0630\u0627\u0643\u0631\u0629 \u0627\u0644\u0645\u0633\u062a\u0647\u0644\u0643\u0629"
    }, {
        "id": 281,
        "translationKeyId": 44,
        "languageId": 5,
        "value": "\u062d\u0641\u0638 \u0627\u0644\u062a\u063a\u064a\u064a\u0631\u0627\u062a"
    }, {
        "id": 282,
        "translationKeyId": 45,
        "languageId": 5,
        "value": "\u0627\u063a\u0644\u0627\u0642"
    }, {
        "id": 283,
        "translationKeyId": 46,
        "languageId": 5,
        "value": "\u0627\u0633\u0623\u0644 \u0633\u0624\u0627\u0644\u0627"
    }, {
        "id": 284,
        "translationKeyId": 47,
        "languageId": 5,
        "value": "\u0645\u0646\u0627\u0642\u0634\u0629 \u0627\u0644\u0645\u0633\u0627\u0626\u0644"
    }, {
        "id": 285,
        "translationKeyId": 48,
        "languageId": 5,
        "value": "\u0627\u0644\u0643\u0648\u062f:"
    }, {
        "id": 286,
        "translationKeyId": 49,
        "languageId": 5,
        "value": "\u062a\u0643\u0628\u064a\u0631 \u0627\u0644\u0634\u0627\u0634\u0629"
    }, {
        "id": 287,
        "translationKeyId": 50,
        "languageId": 5,
        "value": "\u0627\u0635\u0641\u0627\u0621 \u0627\u0644\u0648\u0638\u0627\u0626\u0641"
    }, {
        "id": 288,
        "translationKeyId": 51,
        "languageId": 5,
        "value": "\u0627\u0631\u0633\u0627\u0644"
    }, {
        "id": 289,
        "translationKeyId": 52,
        "languageId": 5,
        "value": "\u0627\u0644\u0627\u0631\u0633\u0627\u0644"
    }, {
        "id": 290,
        "translationKeyId": 53,
        "languageId": 5,
        "value": "\u062d\u062c\u0645 \u0627\u0644\u062a\u0627\u0628"
    }, {
        "id": 291,
        "translationKeyId": 54,
        "languageId": 5,
        "value": "\u0627\u0639\u062f\u0627\u062f\u0627\u062a \u0645\u0633\u0627\u062d\u0629 \u0627\u0644\u0639\u0645\u0644"
    }, {
        "id": 292,
        "translationKeyId": 55,
        "languageId": 5,
        "value": "\u0641\u062a\u062d \u0645\u0644\u0641"
    }, {
        "id": 293,
        "translationKeyId": 56,
        "languageId": 5,
        "value": "\u062a\u0646\u0641\u064a\u0630 \u0627\u0644\u0623\u0645\u062b\u0644\u0629"
    }, {
        "id": 294,
        "translationKeyId": 57,
        "languageId": 5,
        "value": "\u0627\u0644\u062a\u063a\u064a\u064a\u0631\u0627\u062a \u0627\u0644\u063a\u064a\u0631 \u0645\u062d\u0641\u0648\u0638\u0629"
    }, {
        "id": 295,
        "translationKeyId": 58,
        "languageId": 5,
        "value": "\u0648\u0636\u0639 \u0641\u0644\u062a\u0631"
    }, {
        "id": 296,
        "translationKeyId": 59,
        "languageId": 5,
        "value": "\u0642\u0627\u0626\u0645\u0629 \u062c\u0645\u064a\u0639 \u0627\u0644\u0645\u062a\u0635\u062f\u0631\u064a\u0646"
    }, {
        "id": 297,
        "translationKeyId": 60,
        "languageId": 5,
        "value": "\u0627\u0644\u063a\u0627\u0621"
    }, {
        "id": 298,
        "translationKeyId": 61,
        "languageId": 5,
        "value": "\u062a\u0645 \u0627\u0644\u062a\u062e\u0632\u064a\u0646"
    }, {
        "id": 299,
        "translationKeyId": 62,
        "languageId": 5,
        "value": "\u062a\u0645 \u0627\u0644\u062a\u062d\u0645\u064a\u0644!"
    }, {
        "id": 300,
        "translationKeyId": 63,
        "languageId": 5,
        "value": "\u0632\u0645\u0646 \u0627\u0644\u0645\u0639\u0627\u0644\u062c\u0629 \u0627\u0644\u0645\u0633\u062a\u0647\u0644\u0643"
    }, {
        "id": 301,
        "translationKeyId": 64,
        "languageId": 5,
        "value": "\u0627\u0638\u0647\u0627\u0631 \u0647\u0627\u0645\u0634 \u0627\u0644\u0637\u0628\u0627\u0639\u0629"
    }, {
        "id": 302,
        "translationKeyId": 65,
        "languageId": 5,
        "value": "\u062c\u0627\u0631 \u062a\u062d\u0645\u064a\u0644 \u0627\u0644\u062f\u0631\u062f\u0634\u0629..."
    }, {
        "id": 303,
        "translationKeyId": 66,
        "languageId": 5,
        "value": "\u062a\u0646\u0641\u064a\u0630 \u062f\u062e\u0644 \u0645\u062e\u0635\u0635"
    }, {
        "id": 304,
        "translationKeyId": 67,
        "languageId": 5,
        "value": "\u062c\u0627\u0631 \u0627\u0644\u062a\u062d\u0645\u064a\u0644..."
    }, {
        "id": 305,
        "translationKeyId": 68,
        "languageId": 5,
        "value": "\u0627\u0644\u0623\u0645\u062b\u0644\u0629"
    }, {
        "id": 306,
        "translationKeyId": 69,
        "languageId": 5,
        "value": "\u0631\u0633\u0627\u0626\u0644 \u0627\u0644\u0628\u0646\u0627\u0621"
    }, {
        "id": 307,
        "translationKeyId": 70,
        "languageId": 5,
        "value": "\u0627\u0631\u0633\u0627\u0644 \u0641\u064a \u0627\u0631\u0634\u064a\u0641 \u0627\u0644\u0645\u0633\u0627\u0626\u0644"
    }, {
        "id": 308,
        "translationKeyId": 71,
        "languageId": 5,
        "value": "\u0627\u0644\u0645\u0644\u062e\u0635"
    }, {
        "id": 309,
        "translationKeyId": 72,
        "languageId": 5,
        "value": "\u0627\u0644\u0627\u0631\u0633\u0627\u0644\u0627\u062a"
    }, {
        "id": 310,
        "translationKeyId": 73,
        "languageId": 5,
        "value": "\u0632\u0645\u0646 \u0627\u0644\u0645\u0639\u0627\u0644\u062c\u0629:"
    }, {
        "id": 311,
        "translationKeyId": 74,
        "languageId": 5,
        "value": "\u062d\u062c\u0645 \u062e\u0637 \u0627\u0644\u0645\u0644\u0641\u0627\u062a"
    }, {
        "id": 312,
        "translationKeyId": 75,
        "languageId": 5,
        "value": "\u0627\u0644\u062f\u0631\u062f\u0634\u0629 \u0627\u0644\u0639\u0627\u0645\u0629"
    }, {
        "id": 313,
        "translationKeyId": 76,
        "languageId": 5,
        "value": "\u062a\u0648\u0642\u0641 \u0645\u0639 \u0627\u0644\u0631\u0645\u0632"
    }, {
        "id": 314,
        "translationKeyId": 77,
        "languageId": 5,
        "value": "\u062d\u0630\u0641"
    }, {
        "id": 315,
        "translationKeyId": 78,
        "languageId": 5,
        "value": "\u0644\u0627 \u062a\u0648\u062c\u062f \u0645\u0633\u0627\u0628\u0642\u0627\u062a \u0642\u0627\u062f\u0645\u0629."
    }, {
        "id": 316,
        "translationKeyId": 79,
        "languageId": 5,
        "value": "\u0637\u0628\u0627\u0639\u0629 \u0639\u0645\u0648\u062f \u0627\u0644\u0647\u0627\u0645\u0634"
    }, {
        "id": 317,
        "translationKeyId": 80,
        "languageId": 5,
        "value": "\u062a\u062d\u0631\u064a\u0631"
    }, {
        "id": 318,
        "translationKeyId": 81,
        "languageId": 5,
        "value": "\u0627\u0639\u062f\u0627\u062f\u0627\u062a"
    }, {
        "id": 319,
        "translationKeyId": 82,
        "languageId": 5,
        "value": "\u0634\u0643\u0631\u0627 \u0639\u0644\u0649 \u0645\u0644\u0627\u062d\u0638\u0627\u062a\u0643!"
    }, {
        "id": 320,
        "translationKeyId": 83,
        "languageId": 5,
        "value": "\u0627\u0644\u0630\u0627\u0643\u0631\u0629 \u0627\u0644\u0645\u0633\u062a\u0647\u0644\u0643\u0629"
    }, {
        "id": 321,
        "translationKeyId": 84,
        "languageId": 5,
        "value": "\u062d\u062c\u0645 \u062e\u0637 \u0627\u0644\u0643\u0648\u062f"
    }, {
        "id": 322,
        "translationKeyId": 85,
        "languageId": 5,
        "value": "\u0645\u0639\u0627\u064a\u0646\u0629"
    }, {
        "id": 323,
        "translationKeyId": 86,
        "languageId": 5,
        "value": "\u0645\u0633\u0627\u062d\u0629 \u0627\u0644\u0639\u0645\u0644"
    }, {
        "id": 324,
        "translationKeyId": 87,
        "languageId": 5,
        "value": "\u0627\u0644\u0628\u0646\u0627\u0621"
    }, {
        "id": 325,
        "translationKeyId": 88,
        "languageId": 5,
        "value": "\u064a\u062a\u0645 \u0627\u0644\u062d\u0641\u0638..."
    }, {
        "id": 326,
        "translationKeyId": 89,
        "languageId": 5,
        "value": "\u062a\u0639\u062f\u064a\u0644 \u0642\u0627\u0644\u0628 \u0627\u0644\u0640"
    }, {
        "id": 327,
        "translationKeyId": 90,
        "languageId": 5,
        "value": "\u0641\u062a\u062d \u0641\u064a \u0645\u0633\u0627\u062d\u0629 \u0627\u0644\u0639\u0645\u0644"
    }, {
        "id": 328,
        "translationKeyId": 91,
        "languageId": 5,
        "value": "\u0627\u0639\u062f\u0627\u062f \u0627\u0644\u062f\u062e\u0644"
    }, {
        "id": 329,
        "translationKeyId": 92,
        "languageId": 5,
        "value": "Stderr"
    }, {
        "id": 330,
        "translationKeyId": 93,
        "languageId": 5,
        "value": "\u0627\u0638\u0647\u0627\u0631 \u0623\u0631\u0642\u0627\u0645 \u0627\u0644\u0623\u0633\u0637\u0631"
    }, {
        "id": 331,
        "translationKeyId": 94,
        "languageId": 5,
        "value": "\u0645\u0628\u0627\u062f\u0644\u0629"
    }, {
        "id": 332,
        "translationKeyId": 95,
        "languageId": 5,
        "value": "\u0645\u0642\u0627\u0644\u0629"
    }, {
        "id": 333,
        "translationKeyId": 96,
        "languageId": 5,
        "value": "\u062a\u0646\u0641\u064a\u0630"
    }, {
        "id": 334,
        "translationKeyId": 97,
        "languageId": 5,
        "value": "\u0627\u063a\u0644\u0627\u0642 \u0627\u0644\u0643\u0648\u062f"
    }, {
        "id": 335,
        "translationKeyId": 98,
        "languageId": 5,
        "value": "\u0645\u0635\u0641\u0648\u0641\u0629 \u0645\u064a\u0646-\u0645\u0627\u0643\u0633 \u0627\u0644\u062c\u0632\u0626\u064a\u0629"
    }, {
        "id": 336,
        "translationKeyId": 99,
        "languageId": 5,
        "value": "\u0639\u0635\u0628\u0629 \u0627\u0644\u0642\u0633\u0645\u0629"
    }, {
        "id": 337,
        "translationKeyId": 100,
        "languageId": 5,
        "value": "\u0627\u0644\u0642\u0637\u0639 \u0627\u0644\u0645\u062a\u062d\u0631\u0643\u0629"
    }, {
        "id": 338,
        "translationKeyId": 101,
        "languageId": 5,
        "value": "\u0644\u0639\u0628\u0629-A"
    }, {
        "id": 339,
        "translationKeyId": 102,
        "languageId": 5,
        "value": "\u062a\u0628\u062f\u064a\u0644 \u0627\u0644\u0623\u0634\u062c\u0627\u0631"
    }, {
        "id": 340,
        "translationKeyId": 103,
        "languageId": 5,
        "value": "\u0627\u0644\u0643\u0644\u0645\u0627\u062a \u0627\u0644\u0645\u062e\u0631\u0628\u0637\u0629"
    }, {
        "id": 341,
        "translationKeyId": 104,
        "languageId": 5,
        "value": "\u0627\u0644\u0642\u0648\u0627\u0633\u0645 \u0627\u0644\u0641\u0631\u062f\u064a\u0629"
    }, {
        "id": 342,
        "translationKeyId": 105,
        "languageId": 5,
        "value": "\u062a\u0632\u0648\u064a\u062c \u0627\u0644\u062a\u0628\u062f\u064a\u0644\u0627\u062a"
    }, {
        "id": 343,
        "translationKeyId": 106,
        "languageId": 5,
        "value": "\u0643\u062a\u0627\u0628 \u0627\u0644\u0645\u0643\u062a\u0628\u0629"
    }, {
        "id": 344,
        "translationKeyId": 107,
        "languageId": 5,
        "value": "\u0623\u0643\u0628\u0631 \u0627\u0643\u0633-\u0627\u0648\u0631 \u0628\u0637\u0631\u064a\u0642\u0629 \u0623\u0648\u0646\u0644\u0627\u064a\u0646"
    }, {
        "id": 345,
        "translationKeyId": 108,
        "languageId": 5,
        "value": "\u0627\u0644\u062c\u0646\u0648\u062f"
    }, {
        "id": 346,
        "translationKeyId": 109,
        "languageId": 5,
        "value": "\u0627\u0644\u0645\u0633\u0627\u0626\u0644"
    }, {
        "id": 347,
        "translationKeyId": 110,
        "languageId": 5,
        "value": "\u0627\u0644\u062f\u0631\u0648\u0633"
    }, {
        "id": 348,
        "translationKeyId": 111,
        "languageId": 5,
        "value": "\u0627\u0644\u062a\u0637\u0628\u064a\u0642\u0627\u062a"
    }, {
        "id": 349,
        "translationKeyId": 112,
        "languageId": 5,
        "value": "\u0627\u0644\u0645\u0633\u0627\u0628\u0642\u0627\u062a"
    }, {
        "id": 350,
        "translationKeyId": 113,
        "languageId": 5,
        "value": "\u0645\u062f\u0648\u0646\u0629"
    }, {
        "id": 351,
        "translationKeyId": 114,
        "languageId": 5,
        "value": "\u0645\u0646 \u0646\u062d\u0646"
    }, {
        "id": 352,
        "translationKeyId": 115,
        "languageId": 5,
        "value": "\u0645\u0644\u0641\u064a \u0627\u0644\u0634\u062e\u0635\u064a"
    }, {
        "id": 353,
        "translationKeyId": 116,
        "languageId": 5,
        "value": "\u0627\u0639\u062f\u0627\u062f\u0627\u062a \u0627\u0644\u062d\u0633\u0627\u0628"
    }, {
        "id": 354,
        "translationKeyId": 117,
        "languageId": 5,
        "value": "\u062a\u0633\u062c\u064a\u0644 \u0627\u0644\u062e\u0631\u0648\u062c"
    }, {
        "id": 355,
        "translationKeyId": 118,
        "languageId": 5,
        "value": "\u0646\u062a\u064a\u062c\u062a\u0643"
    }, {
        "id": 356,
        "translationKeyId": 119,
        "languageId": 5,
        "value": "\u062a\u0645\u062a \u0627\u0644\u0645\u062d\u0627\u0648\u0644\u0629"
    }, {
        "id": 357,
        "translationKeyId": 120,
        "languageId": 5,
        "value": "\u0627\u0644\u0630\u064a\u0646 \u062a\u0648\u0635\u0644\u0648\u0627 \u0644\u0644\u062d\u0644"
    }, {
        "id": 358,
        "translationKeyId": 121,
        "languageId": 5,
        "value": "\u0627\u0644\u0630\u064a\u0646 \u062d\u0627\u0648\u0644\u0648\u0627 \u062d\u0644\u0647\u0627"
    }, {
        "id": 359,
        "translationKeyId": 122,
        "languageId": 5,
        "value": "\u0646\u0633\u0628\u0629 \u0627\u0644\u0646\u062c\u0627\u062d"
    }, {
        "id": 360,
        "translationKeyId": 124,
        "languageId": 5,
        "value": "\u0644\u0648\u062d\u0629 \u0627\u0644\u0646\u062a\u0627\u0626\u062c"
    }, {
        "id": 361,
        "translationKeyId": 125,
        "languageId": 5,
        "value": "\u0627\u0644\u0627\u0639\u0644\u0627\u0646\u0627\u062a"
    }, {
        "id": 362,
        "translationKeyId": 126,
        "languageId": 5,
        "value": "\u0627\u0644\u0627\u0633\u0626\u0644\u0629"
    }, {
        "id": 363,
        "translationKeyId": 127,
        "languageId": 5,
        "value": "\u062f\u0631\u062f\u0634\u0629"
    }, {
        "id": 364,
        "translationKeyId": 128,
        "languageId": 5,
        "value": "\u064a\u062a\u0645 \u0627\u0644\u0628\u0646\u0627\u0621..."
    }, {
        "id": 365,
        "translationKeyId": 129,
        "languageId": 5,
        "value": "\u062a\u0645 \u0627\u0644\u0628\u0646\u0627\u0621"
    }, {
        "id": 366,
        "translationKeyId": 130,
        "languageId": 5,
        "value": "\u062a\u0633\u062c\u064a\u0644"
    }, {
        "id": 367,
        "translationKeyId": 131,
        "languageId": 5,
        "value": "\u062a\u0645 \u0627\u0644\u062a\u0633\u062c\u064a\u0644"
    }, {
        "id": 368,
        "translationKeyId": 132,
        "languageId": 4,
        "value": "Algoritmi"
    }, {
        "id": 369,
        "translationKeyId": 133,
        "languageId": 4,
        "value": "Interviurile mele"
    }, {
        "id": 370,
        "translationKeyId": 134,
        "languageId": 4,
        "value": "Pagina principal\u0103"
    }, {
        "id": 371,
        "translationKeyId": 135,
        "languageId": 4,
        "value": "Interviuri"
    }, {
        "id": 372,
        "translationKeyId": 136,
        "languageId": 4,
        "value": "Editor de grafuri"
    }, {
        "id": 373,
        "translationKeyId": 137,
        "languageId": 4,
        "value": "Widget de geometrie"
    }, {
        "id": 374,
        "translationKeyId": 138,
        "languageId": 4,
        "value": "Comparare de fi\u0219iere"
    }, {
        "id": 375,
        "translationKeyId": 139,
        "languageId": 4,
        "value": "Profil"
    }, {
        "id": 376,
        "translationKeyId": 140,
        "languageId": 4,
        "value": "Mesaje"
    }, {
        "id": 377,
        "translationKeyId": 141,
        "languageId": 4,
        "value": "Conectat"
    }, {
        "id": 378,
        "translationKeyId": 142,
        "languageId": 4,
        "value": "Deconectat"
    }, {
        "id": 379,
        "translationKeyId": 143,
        "languageId": 4,
        "value": "Se conecteaz\u0103"
    }, {
        "id": 380,
        "translationKeyId": 144,
        "languageId": 4,
        "value": "Deconecteaz\u0103-te"
    }, {
        "id": 381,
        "translationKeyId": 145,
        "languageId": 4,
        "value": "Analiz\u0103"
    }, {
        "id": 382,
        "translationKeyId": 146,
        "languageId": 4,
        "value": "Pozi\u021bie"
    }, {
        "id": 383,
        "translationKeyId": 147,
        "languageId": 4,
        "value": "Utilizator"
    }, {
        "id": 384,
        "translationKeyId": 148,
        "languageId": 4,
        "value": "Scor"
    }, {
        "id": 385,
        "translationKeyId": 149,
        "languageId": 4,
        "value": "Penalizare"
    }, {
        "id": 386,
        "translationKeyId": 150,
        "languageId": 4,
        "value": "virtual"
    }, {
        "id": 387,
        "translationKeyId": 151,
        "languageId": 4,
        "value": "Statistici"
    }, {
        "id": 388,
        "translationKeyId": 152,
        "languageId": 4,
        "value": "Editorial"
    }, {
        "id": 389,
        "translationKeyId": 153,
        "languageId": 4,
        "value": "Participare virtual\u0103"
    }, {
        "id": 390,
        "translationKeyId": 154,
        "languageId": 4,
        "value": "Rating"
    }, {
        "id": 391,
        "translationKeyId": 155,
        "languageId": 4,
        "value": "Forum"
    }, {
        "id": 392,
        "translationKeyId": 156,
        "languageId": 4,
        "value": "Concursuri disponibile"
    }, {
        "id": 393,
        "translationKeyId": 157,
        "languageId": 4,
        "value": "Concursuri viitoare"
    }, {
        "id": 394,
        "translationKeyId": 158,
        "languageId": 4,
        "value": "Concurs"
    }, {
        "id": 395,
        "translationKeyId": 159,
        "languageId": 4,
        "value": "Autentificare"
    }, {
        "id": 396,
        "translationKeyId": 160,
        "languageId": 4,
        "value": "Cont nou"
    }, {
        "id": 397,
        "translationKeyId": 161,
        "languageId": 4,
        "value": "Durat\u0103"
    }, {
        "id": 398,
        "translationKeyId": 162,
        "languageId": 4,
        "value": "Timp de start"
    }, {
        "id": 399,
        "translationKeyId": 163,
        "languageId": 4,
        "value": "Concursuri anterioare"
    }, {
        "id": 400,
        "translationKeyId": 164,
        "languageId": 4,
        "value": "Runde"
    }, {
        "id": 401,
        "translationKeyId": 165,
        "languageId": 4,
        "value": "Algoritmi"
    }, {
        "id": 402,
        "translationKeyId": 166,
        "languageId": 4,
        "value": "Concursuri \u00een desf\u0103\u0219urare"
    }, {
        "id": 403,
        "translationKeyId": 167,
        "languageId": 4,
        "value": "Interviuri"
    }, {
        "id": 404,
        "translationKeyId": 168,
        "languageId": 4,
        "value": "Rezolvate"
    }, {
        "id": 405,
        "translationKeyId": 169,
        "languageId": 4,
        "value": "Procentaj"
    }, {
        "id": 406,
        "translationKeyId": 170,
        "languageId": 4,
        "value": "Statistici"
    }, {
        "id": 407,
        "translationKeyId": 171,
        "languageId": 4,
        "value": "Taguri"
    }, {
        "id": 408,
        "translationKeyId": 172,
        "languageId": 4,
        "value": "Dificultate"
    }, {
        "id": 409,
        "translationKeyId": 173,
        "languageId": 4,
        "value": "Arat\u0103 tagurile"
    }, {
        "id": 410,
        "translationKeyId": 174,
        "languageId": 4,
        "value": "Ai uitat parola?"
    }, {
        "id": 411,
        "translationKeyId": 175,
        "languageId": 4,
        "value": "\u021aine-m\u0103 minte"
    }, {
        "id": 412,
        "translationKeyId": 176,
        "languageId": 4,
        "value": "sau conecteaz\u0103-te cu"
    }, {
        "id": 413,
        "translationKeyId": 177,
        "languageId": 4,
        "value": "Creeaz\u0103 workspace nou"
    }, {
        "id": 414,
        "translationKeyId": 178,
        "languageId": 4,
        "value": "Deschide"
    }, {
        "id": 415,
        "translationKeyId": 179,
        "languageId": 4,
        "value": "Modificat"
    }, {
        "id": 416,
        "translationKeyId": 180,
        "languageId": 4,
        "value": "Concursurile orei"
    }, {
        "id": 417,
        "translationKeyId": 181,
        "languageId": 4,
        "value": "Editeaz\u0103 concurs"
    }, {
        "id": 418,
        "translationKeyId": 182,
        "languageId": 4,
        "value": "Creeaz\u0103 concurs"
    }, {
        "id": 419,
        "translationKeyId": 183,
        "languageId": 4,
        "value": "Utilizatori \u00eenscri\u0219i"
    }, {
        "id": 420,
        "translationKeyId": 124,
        "languageId": 4,
        "value": "Rezultate"
    }, {
        "id": 421,
        "translationKeyId": 126,
        "languageId": 4,
        "value": "\u00centreb\u0103ri"
    }, {
        "id": 422,
        "translationKeyId": 125,
        "languageId": 4,
        "value": "Anun\u021buri"
    }, {
        "id": 423,
        "translationKeyId": 184,
        "languageId": 4,
        "value": "Nu exist\u0103 concursuri programate"
    }, {
        "id": 424,
        "translationKeyId": 185,
        "languageId": 4,
        "value": "Niciun concurs \u00een desf\u0103\u0219urare"
    }, {
        "id": 425,
        "translationKeyId": 186,
        "languageId": 4,
        "value": "Publicat de"
    }, {
        "id": 426,
        "translationKeyId": 187,
        "languageId": 4,
        "value": "Ultima modificare"
    }, {
        "id": 427,
        "translationKeyId": 188,
        "languageId": 4,
        "value": "Continu\u0103 lectura"
    }, {
        "id": 428,
        "translationKeyId": 189,
        "languageId": 4,
        "value": "Informa\u021bii generale"
    }, {
        "id": 429,
        "translationKeyId": 190,
        "languageId": 4,
        "value": "Prenume"
    }, {
        "id": 430,
        "translationKeyId": 191,
        "languageId": 4,
        "value": "Nume de familie"
    }, {
        "id": 431,
        "translationKeyId": 192,
        "languageId": 4,
        "value": "Nume de utilizator"
    }, {
        "id": 432,
        "translationKeyId": 193,
        "languageId": 4,
        "value": "\u021aar\u0103"
    }, {
        "id": 433,
        "translationKeyId": 194,
        "languageId": 4,
        "value": "Parol\u0103"
    }, {
        "id": 434,
        "translationKeyId": 195,
        "languageId": 4,
        "value": "Parola curent\u0103"
    }, {
        "id": 435,
        "translationKeyId": 196,
        "languageId": 4,
        "value": "Parola nou\u0103"
    }, {
        "id": 436,
        "translationKeyId": 197,
        "languageId": 4,
        "value": "din nou"
    }, {
        "id": 437,
        "translationKeyId": 198,
        "languageId": 4,
        "value": "Adrese de e-mail"
    }, {
        "id": 438,
        "translationKeyId": 199,
        "languageId": 4,
        "value": "Urm\u0103toarele adrese de e-mail sunt asociate cu contul dumneavoastr\u0103:"
    }, {
        "id": 439,
        "translationKeyId": 200,
        "languageId": 4,
        "value": "Adaug\u0103 o adres\u0103 de e-mail"
    }, {
        "id": 440,
        "translationKeyId": 201,
        "languageId": 4,
        "value": "Prime\u0219te notific\u0103ri pe e-mail"
    }, {
        "id": 441,
        "translationKeyId": 202,
        "languageId": 4,
        "value": "Contul de Codeforces"
    }, {
        "id": 442,
        "translationKeyId": 203,
        "languageId": 4,
        "value": "Urm\u0103torul cont de Codeforces este asociat cu contul dumneavoastr\u0103:"
    }, {
        "id": 443,
        "translationKeyId": 204,
        "languageId": 4,
        "value": "Deconecteaz\u0103"
    }, {
        "id": 444,
        "translationKeyId": 205,
        "languageId": 4,
        "value": "Preia numele de utilizator"
    }, {
        "id": 445,
        "translationKeyId": 206,
        "languageId": 4,
        "value": "Asociaz\u0103 contul de Codeforces"
    }, {
        "id": 446,
        "translationKeyId": 207,
        "languageId": 4,
        "value": "Nume de utilizator"
    }, {
        "id": 447,
        "translationKeyId": 208,
        "languageId": 4,
        "value": "Trimite-ne un mesaj privat cu acest cod:"
    }, {
        "id": 448,
        "translationKeyId": 209,
        "languageId": 4,
        "value": "Apas\u0103 butonul de mai jos pentru a deschide Codeforces (\u00een alt\u0103 fereastr\u0103), pentru a trimite codul:"
    }, {
        "id": 449,
        "translationKeyId": 210,
        "languageId": 4,
        "value": "Deschide Codeforces"
    }, {
        "id": 450,
        "translationKeyId": 211,
        "languageId": 4,
        "value": "Asociaz\u0103 un cont extern"
    }, {
        "id": 451,
        "translationKeyId": 212,
        "languageId": 4,
        "value": "Asociaz\u0103 contul Google"
    }, {
        "id": 452,
        "translationKeyId": 213,
        "languageId": 4,
        "value": "Asociaz\u0103 contul Facebook"
    }, {
        "id": 453,
        "translationKeyId": 214,
        "languageId": 4,
        "value": "Conturi de pe re\u021bele sociale"
    }, {
        "id": 454,
        "translationKeyId": 215,
        "languageId": 4,
        "value": "Pute\u021bi s\u0103 v\u0103 autentifica\u021bi folosind oricare din urm\u0103toarele conturi de pe re\u021bele sociale:"
    }, {
        "id": 455,
        "translationKeyId": 216,
        "languageId": 4,
        "value": "Momentan nu ave\u021bi niciun cont de pe re\u021bele sociale asociat cu contul dumneavoastr\u0103."
    }, {
        "id": 456,
        "translationKeyId": 217,
        "languageId": 4,
        "value": "Email"
    }, {
        "id": 457,
        "translationKeyId": 218,
        "languageId": 4,
        "value": "Conturi externe"
    }, {
        "id": 458,
        "translationKeyId": 219,
        "languageId": 4,
        "value": "Securitate"
    }, {
        "id": 459,
        "translationKeyId": 54,
        "languageId": 4,
        "value": "Set\u0103ri de workspace"
    }],
    "TranslationKey": [{
        "id": 1,
        "value": "Run"
    }, {
        "id": 2,
        "value": "Compile"
    }, {
        "id": 3,
        "value": "Time limit:"
    }, {
        "id": 4,
        "value": "Memory limit:"
    }, {
        "id": 6,
        "value": "Latest Blog Entries"
    }, {
        "id": 7,
        "value": "Upcoming Contests"
    }, {
        "id": 8,
        "value": "Leaderboard"
    }, {
        "id": 9,
        "value": "Input"
    }, {
        "id": 10,
        "value": "Output"
    }, {
        "id": 5,
        "value": "Addition"
    }, {
        "id": 11,
        "value": "Word Ordering"
    }, {
        "id": 12,
        "value": "Sorting Partition"
    }, {
        "id": 13,
        "value": "Unfair Game"
    }, {
        "id": 14,
        "value": "Swap Permutation"
    }, {
        "id": 15,
        "value": "Colored Marbles"
    }, {
        "id": 16,
        "value": "Platforms"
    }, {
        "id": 17,
        "value": "Two Progressions"
    }, {
        "id": 18,
        "value": "Number Elimination"
    }, {
        "id": 19,
        "value": "Word Permutation"
    }, {
        "id": 20,
        "value": "Online Gcd"
    }, {
        "id": 21,
        "value": "Circular Subarrays"
    }, {
        "id": 22,
        "value": "Lightbulbs"
    }, {
        "id": 23,
        "value": "Matrix Coloring"
    }, {
        "id": 24,
        "value": "Tree Game"
    }, {
        "id": 25,
        "value": "Source"
    }, {
        "id": 26,
        "value": "Statement"
    }, {
        "id": 27,
        "value": "Feedback"
    }, {
        "id": 28,
        "value": "Split view"
    }, {
        "id": 29,
        "value": "See full contests list"
    }, {
        "id": 30,
        "value": "Send feedback"
    }, {
        "id": 31,
        "value": "Theme"
    }, {
        "id": 32,
        "value": "Explanation"
    }, {
        "id": 33,
        "value": "Online:"
    }, {
        "id": 34,
        "value": "Open task in Task Archive"
    }, {
        "id": 35,
        "value": "Editor"
    }, {
        "id": 36,
        "value": "Tell us what you think!"
    }, {
        "id": 37,
        "value": "Preferred language:"
    }, {
        "id": 38,
        "value": "Task"
    }, {
        "id": 39,
        "value": "Results"
    }, {
        "id": 40,
        "value": "Download Source"
    }, {
        "id": 41,
        "value": "Save template for"
    }, {
        "id": 42,
        "value": "Language:"
    }, {
        "id": 43,
        "value": "Memory usage:"
    }, {
        "id": 44,
        "value": "Save changes"
    }, {
        "id": 45,
        "value": "Close"
    }, {
        "id": 46,
        "value": "Ask question"
    }, {
        "id": 47,
        "value": "Task Discussion"
    }, {
        "id": 48,
        "value": "Source code:"
    }, {
        "id": 49,
        "value": "Fullscreen"
    }, {
        "id": 50,
        "value": "Filter jobs"
    }, {
        "id": 51,
        "value": "Submit"
    }, {
        "id": 52,
        "value": "Submission"
    }, {
        "id": 53,
        "value": "Tab size"
    }, {
        "id": 55,
        "value": "Open file"
    }, {
        "id": 56,
        "value": "Run examples"
    }, {
        "id": 57,
        "value": "Unsaved changes"
    }, {
        "id": 58,
        "value": "Set filter"
    }, {
        "id": 59,
        "value": "See full leaderboard"
    }, {
        "id": 60,
        "value": "Cancel"
    }, {
        "id": 61,
        "value": "Saved"
    }, {
        "id": 62,
        "value": "Successfully uploaded!"
    }, {
        "id": 63,
        "value": "CPU Time"
    }, {
        "id": 64,
        "value": "Show print margin"
    }, {
        "id": 65,
        "value": "Chat loading..."
    }, {
        "id": 66,
        "value": "Run custom input"
    }, {
        "id": 67,
        "value": "Uploading..."
    }, {
        "id": 68,
        "value": "Examples"
    }, {
        "id": 69,
        "value": "Compilation messages"
    }, {
        "id": 70,
        "value": "Submit in Task Archive"
    }, {
        "id": 71,
        "value": "Summary"
    }, {
        "id": 72,
        "value": "Submissions"
    }, {
        "id": 73,
        "value": "CPU Time usage:"
    }, {
        "id": 74,
        "value": "Files font size"
    }, {
        "id": 75,
        "value": "Global Chat"
    }, {
        "id": 76,
        "value": "Killed by signal"
    }, {
        "id": 77,
        "value": "Delete"
    }, {
        "id": 78,
        "value": "No upcoming contests."
    }, {
        "id": 79,
        "value": "Print margin column"
    }, {
        "id": 80,
        "value": "Edit"
    }, {
        "id": 81,
        "value": "Settings"
    }, {
        "id": 82,
        "value": "Thanks for your feedback!"
    }, {
        "id": 83,
        "value": "Memory Usage"
    }, {
        "id": 84,
        "value": "Code font size"
    }, {
        "id": 85,
        "value": "Preview"
    }, {
        "id": 86,
        "value": "Workspace"
    }, {
        "id": 87,
        "value": "Compilation"
    }, {
        "id": 88,
        "value": "Saving..."
    }, {
        "id": 89,
        "value": "Edit your template for"
    }, {
        "id": 90,
        "value": "Load in Workspace"
    }, {
        "id": 91,
        "value": "Set input"
    }, {
        "id": 92,
        "value": "Stderr"
    }, {
        "id": 93,
        "value": "Show line number"
    }, {
        "id": 94,
        "value": "Swap"
    }, {
        "id": 95,
        "value": "Article"
    }, {
        "id": 96,
        "value": "Execution"
    }, {
        "id": 97,
        "value": "Exit Code"
    }, {
        "id": 98,
        "value": "MinMax Subarray"
    }, {
        "id": 99,
        "value": "Divisor Clique"
    }, {
        "id": 100,
        "value": "Moving Segments"
    }, {
        "id": 101,
        "value": "A-Game"
    }, {
        "id": 102,
        "value": "Tree Swapping"
    }, {
        "id": 103,
        "value": "Anagrams"
    }, {
        "id": 104,
        "value": "Odd Divisors"
    }, {
        "id": 105,
        "value": "Swap Pairing"
    }, {
        "id": 106,
        "value": "Library Book"
    }, {
        "id": 107,
        "value": "Online XorMax"
    }, {
        "id": 108,
        "value": "Soldiers"
    }, {
        "id": 109,
        "value": "Tasks"
    }, {
        "id": 110,
        "value": "Lessons"
    }, {
        "id": 111,
        "value": "Apps"
    }, {
        "id": 112,
        "value": "Contests"
    }, {
        "id": 113,
        "value": "Blog"
    }, {
        "id": 114,
        "value": "About"
    }, {
        "id": 115,
        "value": "My Profile"
    }, {
        "id": 116,
        "value": "Account settings"
    }, {
        "id": 117,
        "value": "Sign Out"
    }, {
        "id": 118,
        "value": "Your score"
    }, {
        "id": 119,
        "value": "Tried"
    }, {
        "id": 120,
        "value": "Users solved"
    }, {
        "id": 121,
        "value": "Users tried"
    }, {
        "id": 122,
        "value": "Success rate"
    }, {
        "id": 124,
        "value": "Scoreboard"
    }, {
        "id": 125,
        "value": "Announcements"
    }, {
        "id": 126,
        "value": "Questions"
    }, {
        "id": 127,
        "value": "Chat"
    }, {
        "id": 128,
        "value": "Compiling..."
    }, {
        "id": 129,
        "value": "Compiled"
    }, {
        "id": 130,
        "value": "Register"
    }, {
        "id": 131,
        "value": "Registered"
    }, {
        "id": 132,
        "value": "Algorithms"
    }, {
        "id": 133,
        "value": "My Interviews"
    }, {
        "id": 134,
        "value": "Home"
    }, {
        "id": 135,
        "value": "Interviews"
    }, {
        "id": 136,
        "value": "Graph Editor"
    }, {
        "id": 137,
        "value": "Geometry Widget"
    }, {
        "id": 138,
        "value": "Diff Tool"
    }, {
        "id": 139,
        "value": "Profile"
    }, {
        "id": 140,
        "value": "Messages"
    }, {
        "id": 141,
        "value": "Connected"
    }, {
        "id": 142,
        "value": "Disconnected"
    }, {
        "id": 143,
        "value": "Connecting"
    }, {
        "id": 144,
        "value": "Logout"
    }, {
        "id": 145,
        "value": "Analysis"
    }, {
        "id": 146,
        "value": "Rank"
    }, {
        "id": 147,
        "value": "User"
    }, {
        "id": 148,
        "value": "Score"
    }, {
        "id": 149,
        "value": "Penalty"
    }, {
        "id": 150,
        "value": "virtual"
    }, {
        "id": 151,
        "value": "Statistics"
    }, {
        "id": 152,
        "value": "Editorial"
    }, {
        "id": 153,
        "value": "Virtual participation"
    }, {
        "id": 154,
        "value": "Rating"
    }, {
        "id": 155,
        "value": "Forum"
    }, {
        "id": 156,
        "value": "Available contests"
    }, {
        "id": 157,
        "value": "Future contests"
    }, {
        "id": 158,
        "value": "Contest"
    }, {
        "id": 159,
        "value": "Log In"
    }, {
        "id": 160,
        "value": "Sign Up"
    }, {
        "id": 161,
        "value": "Duration"
    }, {
        "id": 162,
        "value": "Start time"
    }, {
        "id": 163,
        "value": "Past contests"
    }, {
        "id": 164,
        "value": "Rounds"
    }, {
        "id": 165,
        "value": "Hourly Algorithms"
    }, {
        "id": 166,
        "value": "Running contests"
    }, {
        "id": 167,
        "value": "Hourly Interviews"
    }, {
        "id": 168,
        "value": "Solved"
    }, {
        "id": 169,
        "value": "Ratio"
    }, {
        "id": 170,
        "value": "Stats"
    }, {
        "id": 171,
        "value": "Tags"
    }, {
        "id": 172,
        "value": "Difficulty"
    }, {
        "id": 173,
        "value": "Show tags"
    }, {
        "id": 174,
        "value": "Forgot Password?"
    }, {
        "id": 175,
        "value": "Remember me"
    }, {
        "id": 176,
        "value": "or connect with"
    }, {
        "id": 177,
        "value": "Create new workspace"
    }, {
        "id": 178,
        "value": "Open"
    }, {
        "id": 179,
        "value": "Updated"
    }, {
        "id": 180,
        "value": "Hourly Contests"
    }, {
        "id": 181,
        "value": "Edit contest"
    }, {
        "id": 182,
        "value": "Create contest"
    }, {
        "id": 183,
        "value": "Users registered"
    }, {
        "id": 184,
        "value": "No contest scheduled"
    }, {
        "id": 185,
        "value": "No contest running"
    }, {
        "id": 186,
        "value": "Written by"
    }, {
        "id": 187,
        "value": "Last update on"
    }, {
        "id": 188,
        "value": "Continue reading"
    }, {
        "id": 189,
        "value": "General info"
    }, {
        "id": 190,
        "value": "First Name"
    }, {
        "id": 191,
        "value": "Last Name"
    }, {
        "id": 192,
        "value": "Username"
    }, {
        "id": 193,
        "value": "Country"
    }, {
        "id": 194,
        "value": "Password",
        "comment": "Parol\u0103"
    }, {
        "id": 195,
        "value": "Current Password"
    }, {
        "id": 196,
        "value": "New Password"
    }, {
        "id": 197,
        "value": "again"
    }, {
        "id": 198,
        "value": "E-mail Addresses"
    }, {
        "id": 199,
        "value": "The following e-mail addresses are associated with your account:"
    }, {
        "id": 200,
        "value": "Add E-mail Address"
    }, {
        "id": 201,
        "value": "Receive email notifications"
    }, {
        "id": 202,
        "value": "Codeforces account"
    }, {
        "id": 203,
        "value": "The following codeforces account is linked with your account:"
    }, {
        "id": 204,
        "value": "Unlink"
    }, {
        "id": 205,
        "value": "Import handle"
    }, {
        "id": 206,
        "value": "Link Codeforces account"
    }, {
        "id": 207,
        "value": "Handle"
    }, {
        "id": 208,
        "value": "Send us a private message with this token:"
    }, {
        "id": 209,
        "value": "Click bellow to open Codeforces (in a new window) to send us this token:"
    }, {
        "id": 210,
        "value": "Open Codeforces"
    }, {
        "id": 211,
        "value": "Add a 3rd Party Account"
    }, {
        "id": 212,
        "value": "Connect Google account"
    }, {
        "id": 213,
        "value": "Connect Facebook account"
    }, {
        "id": 214,
        "value": "Social accounts"
    }, {
        "id": 215,
        "value": "You can sign in to your account using any of the following third party accounts:"
    }, {
        "id": 216,
        "value": "You currently have no social network accounts connected to this account."
    }, {
        "id": 217,
        "value": "Email"
    }, {
        "id": 218,
        "value": "External accounts"
    }, {
        "id": 219,
        "value": "Security"
    }, {
        "id": 54,
        "value": "Workspace Settings"
    }],
    "country": [{
        "id": 1,
        "name": "Senegal",
        "isoCode": "SN",
        "iso3Code": "SEN",
        "phoneNumberPrefix": "221"
    }, {
        "id": 2,
        "name": "British Indian Ocean Territory",
        "isoCode": "IO",
        "iso3Code": "IOT",
        "phoneNumberPrefix": "246"
    }, {
        "id": 3,
        "name": "South Georgia and the South Sandwich Islands",
        "isoCode": "GS",
        "iso3Code": "SGS",
        "phoneNumberPrefix": ""
    }, {
        "id": 4,
        "name": "Chad",
        "isoCode": "TD",
        "iso3Code": "TCD",
        "phoneNumberPrefix": "235"
    }, {
        "id": 5,
        "name": "Guyana",
        "isoCode": "GY",
        "iso3Code": "GUY",
        "phoneNumberPrefix": "592"
    }, {
        "id": 6,
        "name": "Netherlands",
        "isoCode": "NL",
        "iso3Code": "NLD",
        "phoneNumberPrefix": "31"
    }, {
        "id": 7,
        "name": "Suriname",
        "isoCode": "SR",
        "iso3Code": "SUR",
        "phoneNumberPrefix": "597"
    }, {
        "id": 8,
        "name": "Solomon Islands",
        "isoCode": "SB",
        "iso3Code": "SLB",
        "phoneNumberPrefix": "677"
    }, {
        "id": 9,
        "name": "Brazil",
        "isoCode": "BR",
        "iso3Code": "BRA",
        "phoneNumberPrefix": "55"
    }, {
        "id": 10,
        "name": "Belarus",
        "isoCode": "BY",
        "iso3Code": "BLR",
        "phoneNumberPrefix": "375"
    }, {
        "id": 11,
        "name": "Libya",
        "isoCode": "LY",
        "iso3Code": "LBY",
        "phoneNumberPrefix": "218"
    }, {
        "id": 12,
        "name": "Heard Island and McDonald Islands",
        "isoCode": "HM",
        "iso3Code": "HMD",
        "phoneNumberPrefix": " "
    }, {
        "id": 13,
        "name": "Papua New Guinea",
        "isoCode": "PG",
        "iso3Code": "PNG",
        "phoneNumberPrefix": "675"
    }, {
        "id": 14,
        "name": "United Arab Emirates",
        "isoCode": "AE",
        "iso3Code": "ARE",
        "phoneNumberPrefix": "971"
    }, {
        "id": 15,
        "name": "Albania",
        "isoCode": "AL",
        "iso3Code": "ALB",
        "phoneNumberPrefix": "355"
    }, {
        "id": 16,
        "name": "Belgium",
        "isoCode": "BE",
        "iso3Code": "BEL",
        "phoneNumberPrefix": "32"
    }, {
        "id": 17,
        "name": "India",
        "isoCode": "IN",
        "iso3Code": "IND",
        "phoneNumberPrefix": "91"
    }, {
        "id": 18,
        "name": "Yemen",
        "isoCode": "YE",
        "iso3Code": "YEM",
        "phoneNumberPrefix": "967"
    }, {
        "id": 19,
        "name": "Bosnia and Herzegovina",
        "isoCode": "BA",
        "iso3Code": "BIH",
        "phoneNumberPrefix": "387"
    }, {
        "id": 20,
        "name": "Guernsey",
        "isoCode": "GG",
        "iso3Code": "GGY",
        "phoneNumberPrefix": "+44-1481"
    }, {
        "id": 21,
        "name": "Pakistan",
        "isoCode": "PK",
        "iso3Code": "PAK",
        "phoneNumberPrefix": "92"
    }, {
        "id": 22,
        "name": "Saint Lucia",
        "isoCode": "LC",
        "iso3Code": "LCA",
        "phoneNumberPrefix": "+1-758"
    }, {
        "id": 23,
        "name": "Belize",
        "isoCode": "BZ",
        "iso3Code": "BLZ",
        "phoneNumberPrefix": "501"
    }, {
        "id": 24,
        "name": "Bonaire, Saint Eustatius and Saba ",
        "isoCode": "BQ",
        "iso3Code": "BES",
        "phoneNumberPrefix": "599"
    }, {
        "id": 25,
        "name": "Fiji",
        "isoCode": "FJ",
        "iso3Code": "FJI",
        "phoneNumberPrefix": "679"
    }, {
        "id": 26,
        "name": "Cape Verde",
        "isoCode": "CV",
        "iso3Code": "CPV",
        "phoneNumberPrefix": "238"
    }, {
        "id": 27,
        "name": "Sierra Leone",
        "isoCode": "SL",
        "iso3Code": "SLE",
        "phoneNumberPrefix": "232"
    }, {
        "id": 28,
        "name": "Uganda",
        "isoCode": "UG",
        "iso3Code": "UGA",
        "phoneNumberPrefix": "256"
    }, {
        "id": 29,
        "name": "Somalia",
        "isoCode": "SO",
        "iso3Code": "SOM",
        "phoneNumberPrefix": "252"
    }, {
        "id": 30,
        "name": "Saint Martin",
        "isoCode": "MF",
        "iso3Code": "MAF",
        "phoneNumberPrefix": "590"
    }, {
        "id": 31,
        "name": "Malta",
        "isoCode": "MT",
        "iso3Code": "MLT",
        "phoneNumberPrefix": "356"
    }, {
        "id": 32,
        "name": "Bermuda",
        "isoCode": "BM",
        "iso3Code": "BMU",
        "phoneNumberPrefix": "+1-441"
    }, {
        "id": 33,
        "name": "South Korea",
        "isoCode": "KR",
        "iso3Code": "KOR",
        "phoneNumberPrefix": "82"
    }, {
        "id": 34,
        "name": "United States Minor Outlying Islands",
        "isoCode": "UM",
        "iso3Code": "UMI",
        "phoneNumberPrefix": "1"
    }, {
        "id": 35,
        "name": "Grenada",
        "isoCode": "GD",
        "iso3Code": "GRD",
        "phoneNumberPrefix": "+1-473"
    }, {
        "id": 36,
        "name": "Ukraine",
        "isoCode": "UA",
        "iso3Code": "UKR",
        "phoneNumberPrefix": "380"
    }, {
        "id": 37,
        "name": "Sweden",
        "isoCode": "SE",
        "iso3Code": "SWE",
        "phoneNumberPrefix": "46"
    }, {
        "id": 38,
        "name": "El Salvador",
        "isoCode": "SV",
        "iso3Code": "SLV",
        "phoneNumberPrefix": "503"
    }, {
        "id": 39,
        "name": "Bahrain",
        "isoCode": "BH",
        "iso3Code": "BHR",
        "phoneNumberPrefix": "973"
    }, {
        "id": 40,
        "name": "Kyrgyzstan",
        "isoCode": "KG",
        "iso3Code": "KGZ",
        "phoneNumberPrefix": "996"
    }, {
        "id": 41,
        "name": "Turks and Caicos Islands",
        "isoCode": "TC",
        "iso3Code": "TCA",
        "phoneNumberPrefix": "+1-649"
    }, {
        "id": 42,
        "name": "Antarctica",
        "isoCode": "AQ",
        "iso3Code": "ATA",
        "phoneNumberPrefix": ""
    }, {
        "id": 43,
        "name": "Jordan",
        "isoCode": "JO",
        "iso3Code": "JOR",
        "phoneNumberPrefix": "962"
    }, {
        "id": 44,
        "name": "Venezuela",
        "isoCode": "VE",
        "iso3Code": "VEN",
        "phoneNumberPrefix": "58"
    }, {
        "id": 45,
        "name": "Qatar",
        "isoCode": "QA",
        "iso3Code": "QAT",
        "phoneNumberPrefix": "974"
    }, {
        "id": 46,
        "name": "Pitcairn",
        "isoCode": "PN",
        "iso3Code": "PCN",
        "phoneNumberPrefix": "870"
    }, {
        "id": 47,
        "name": "Ireland",
        "isoCode": "IE",
        "iso3Code": "IRL",
        "phoneNumberPrefix": "353"
    }, {
        "id": 48,
        "name": "Haiti",
        "isoCode": "HT",
        "iso3Code": "HTI",
        "phoneNumberPrefix": "509"
    }, {
        "id": 49,
        "name": "Iraq",
        "isoCode": "IQ",
        "iso3Code": "IRQ",
        "phoneNumberPrefix": "964"
    }, {
        "id": 50,
        "name": "Angola",
        "isoCode": "AO",
        "iso3Code": "AGO",
        "phoneNumberPrefix": "244"
    }, {
        "id": 51,
        "name": "United States",
        "isoCode": "US",
        "iso3Code": "USA",
        "phoneNumberPrefix": "1"
    }, {
        "id": 52,
        "name": "Uruguay",
        "isoCode": "UY",
        "iso3Code": "URY",
        "phoneNumberPrefix": "598"
    }, {
        "id": 53,
        "name": "Puerto Rico",
        "isoCode": "PR",
        "iso3Code": "PRI",
        "phoneNumberPrefix": "+1-787"
    }, {
        "id": 54,
        "name": "Malaysia",
        "isoCode": "MY",
        "iso3Code": "MYS",
        "phoneNumberPrefix": "60"
    }, {
        "id": 55,
        "name": "Wallis and Futuna",
        "isoCode": "WF",
        "iso3Code": "WLF",
        "phoneNumberPrefix": "681"
    }, {
        "id": 56,
        "name": "American Samoa",
        "isoCode": "AS",
        "iso3Code": "ASM",
        "phoneNumberPrefix": "+1-684"
    }, {
        "id": 57,
        "name": "Antigua and Barbuda",
        "isoCode": "AG",
        "iso3Code": "ATG",
        "phoneNumberPrefix": "+1-268"
    }, {
        "id": 58,
        "name": "Djibouti",
        "isoCode": "DJ",
        "iso3Code": "DJI",
        "phoneNumberPrefix": "253"
    }, {
        "id": 59,
        "name": "Iran",
        "isoCode": "IR",
        "iso3Code": "IRN",
        "phoneNumberPrefix": "98"
    }, {
        "id": 60,
        "name": "Kuwait",
        "isoCode": "KW",
        "iso3Code": "KWT",
        "phoneNumberPrefix": "965"
    }, {
        "id": 61,
        "name": "Bahamas",
        "isoCode": "BS",
        "iso3Code": "BHS",
        "phoneNumberPrefix": "+1-242"
    }, {
        "id": 62,
        "name": "Eritrea",
        "isoCode": "ER",
        "iso3Code": "ERI",
        "phoneNumberPrefix": "291"
    }, {
        "id": 63,
        "name": "North Korea",
        "isoCode": "KP",
        "iso3Code": "PRK",
        "phoneNumberPrefix": "850"
    }, {
        "id": 64,
        "name": "Hungary",
        "isoCode": "HU",
        "iso3Code": "HUN",
        "phoneNumberPrefix": "36"
    }, {
        "id": 65,
        "name": "Swaziland",
        "isoCode": "SZ",
        "iso3Code": "SWZ",
        "phoneNumberPrefix": "268"
    }, {
        "id": 66,
        "name": "Nicaragua",
        "isoCode": "NI",
        "iso3Code": "NIC",
        "phoneNumberPrefix": "505"
    }, {
        "id": 67,
        "name": "Israel",
        "isoCode": "IL",
        "iso3Code": "ISR",
        "phoneNumberPrefix": "972"
    }, {
        "id": 68,
        "name": "Lebanon",
        "isoCode": "LB",
        "iso3Code": "LBN",
        "phoneNumberPrefix": "961"
    }, {
        "id": 69,
        "name": "Liechtenstein",
        "isoCode": "LI",
        "iso3Code": "LIE",
        "phoneNumberPrefix": "423"
    }, {
        "id": 70,
        "name": "Gabon",
        "isoCode": "GA",
        "iso3Code": "GAB",
        "phoneNumberPrefix": "241"
    }, {
        "id": 71,
        "name": "Mexico",
        "isoCode": "MX",
        "iso3Code": "MEX",
        "phoneNumberPrefix": "52"
    }, {
        "id": 72,
        "name": "Jersey",
        "isoCode": "JE",
        "iso3Code": "JEY",
        "phoneNumberPrefix": "+44-1534"
    }, {
        "id": 73,
        "name": "French Guiana",
        "isoCode": "GF",
        "iso3Code": "GUF",
        "phoneNumberPrefix": "594"
    }, {
        "id": 74,
        "name": "Egypt",
        "isoCode": "EG",
        "iso3Code": "EGY",
        "phoneNumberPrefix": "20"
    }, {
        "id": 75,
        "name": "Portugal",
        "isoCode": "PT",
        "iso3Code": "PRT",
        "phoneNumberPrefix": "351"
    }, {
        "id": 76,
        "name": "Saint Pierre and Miquelon",
        "isoCode": "PM",
        "iso3Code": "SPM",
        "phoneNumberPrefix": "508"
    }, {
        "id": 77,
        "name": "Slovenia",
        "isoCode": "SI",
        "iso3Code": "SVN",
        "phoneNumberPrefix": "386"
    }, {
        "id": 78,
        "name": "Latvia",
        "isoCode": "LV",
        "iso3Code": "LVA",
        "phoneNumberPrefix": "371"
    }, {
        "id": 79,
        "name": "Cambodia",
        "isoCode": "KH",
        "iso3Code": "KHM",
        "phoneNumberPrefix": "855"
    }, {
        "id": 80,
        "name": "Mauritania",
        "isoCode": "MR",
        "iso3Code": "MRT",
        "phoneNumberPrefix": "222"
    }, {
        "id": 81,
        "name": "Turkmenistan",
        "isoCode": "TM",
        "iso3Code": "TKM",
        "phoneNumberPrefix": "993"
    }, {
        "id": 82,
        "name": "Macao",
        "isoCode": "MO",
        "iso3Code": "MAC",
        "phoneNumberPrefix": "853"
    }, {
        "id": 83,
        "name": "Burundi",
        "isoCode": "BI",
        "iso3Code": "BDI",
        "phoneNumberPrefix": "257"
    }, {
        "id": 84,
        "name": "Germany",
        "isoCode": "DE",
        "iso3Code": "DEU",
        "phoneNumberPrefix": "49"
    }, {
        "id": 85,
        "name": "Colombia",
        "isoCode": "CO",
        "iso3Code": "COL",
        "phoneNumberPrefix": "57"
    }, {
        "id": 86,
        "name": "Falkland Islands",
        "isoCode": "FK",
        "iso3Code": "FLK",
        "phoneNumberPrefix": "500"
    }, {
        "id": 87,
        "name": "Samoa",
        "isoCode": "WS",
        "iso3Code": "WSM",
        "phoneNumberPrefix": "685"
    }, {
        "id": 88,
        "name": "French Southern Territories",
        "isoCode": "TF",
        "iso3Code": "ATF",
        "phoneNumberPrefix": ""
    }, {
        "id": 89,
        "name": "Monaco",
        "isoCode": "MC",
        "iso3Code": "MCO",
        "phoneNumberPrefix": "377"
    }, {
        "id": 90,
        "name": "Gibraltar",
        "isoCode": "GI",
        "iso3Code": "GIB",
        "phoneNumberPrefix": "350"
    }, {
        "id": 91,
        "name": "Georgia",
        "isoCode": "GE",
        "iso3Code": "GEO",
        "phoneNumberPrefix": "995"
    }, {
        "id": 92,
        "name": "Czech Republic",
        "isoCode": "CZ",
        "iso3Code": "CZE",
        "phoneNumberPrefix": "420"
    }, {
        "id": 93,
        "name": "Sudan",
        "isoCode": "SD",
        "iso3Code": "SDN",
        "phoneNumberPrefix": "249"
    }, {
        "id": 94,
        "name": "Niue",
        "isoCode": "NU",
        "iso3Code": "NIU",
        "phoneNumberPrefix": "683"
    }, {
        "id": 95,
        "name": "Malawi",
        "isoCode": "MW",
        "iso3Code": "MWI",
        "phoneNumberPrefix": "265"
    }, {
        "id": 96,
        "name": "Equatorial Guinea",
        "isoCode": "GQ",
        "iso3Code": "GNQ",
        "phoneNumberPrefix": "240"
    }, {
        "id": 97,
        "name": "Bulgaria",
        "isoCode": "BG",
        "iso3Code": "BGR",
        "phoneNumberPrefix": "359"
    }, {
        "id": 98,
        "name": "French Polynesia",
        "isoCode": "PF",
        "iso3Code": "PYF",
        "phoneNumberPrefix": "689"
    }, {
        "id": 99,
        "name": "Guam",
        "isoCode": "GU",
        "iso3Code": "GUM",
        "phoneNumberPrefix": "+1-671"
    }, {
        "id": 100,
        "name": "Greenland",
        "isoCode": "GL",
        "iso3Code": "GRL",
        "phoneNumberPrefix": "299"
    }, {
        "id": 101,
        "name": "Republic of the Congo",
        "isoCode": "CG",
        "iso3Code": "COG",
        "phoneNumberPrefix": "242"
    }, {
        "id": 102,
        "name": "Saint Vincent and the Grenadines",
        "isoCode": "VC",
        "iso3Code": "VCT",
        "phoneNumberPrefix": "+1-784"
    }, {
        "id": 103,
        "name": "Lesotho",
        "isoCode": "LS",
        "iso3Code": "LSO",
        "phoneNumberPrefix": "266"
    }, {
        "id": 104,
        "name": "Philippines",
        "isoCode": "PH",
        "iso3Code": "PHL",
        "phoneNumberPrefix": "63"
    }, {
        "id": 105,
        "name": "Trinidad and Tobago",
        "isoCode": "TT",
        "iso3Code": "TTO",
        "phoneNumberPrefix": "+1-868"
    }, {
        "id": 106,
        "name": "Laos",
        "isoCode": "LA",
        "iso3Code": "LAO",
        "phoneNumberPrefix": "856"
    }, {
        "id": 107,
        "name": "Indonesia",
        "isoCode": "ID",
        "iso3Code": "IDN",
        "phoneNumberPrefix": "62"
    }, {
        "id": 108,
        "name": "United Kingdom",
        "isoCode": "GB",
        "iso3Code": "GBR",
        "phoneNumberPrefix": "44"
    }, {
        "id": 109,
        "name": "Niger",
        "isoCode": "NE",
        "iso3Code": "NER",
        "phoneNumberPrefix": "227"
    }, {
        "id": 110,
        "name": "Paraguay",
        "isoCode": "PY",
        "iso3Code": "PRY",
        "phoneNumberPrefix": "595"
    }, {
        "id": 111,
        "name": "Syria",
        "isoCode": "SY",
        "iso3Code": "SYR",
        "phoneNumberPrefix": "963"
    }, {
        "id": 112,
        "name": "Uzbekistan",
        "isoCode": "UZ",
        "iso3Code": "UZB",
        "phoneNumberPrefix": "998"
    }, {
        "id": 113,
        "name": "Vatican",
        "isoCode": "VA",
        "iso3Code": "VAT",
        "phoneNumberPrefix": "379"
    }, {
        "id": 114,
        "name": "Western Sahara",
        "isoCode": "EH",
        "iso3Code": "ESH",
        "phoneNumberPrefix": "212"
    }, {
        "id": 115,
        "name": "Argentina",
        "isoCode": "AR",
        "iso3Code": "ARG",
        "phoneNumberPrefix": "54"
    }, {
        "id": 116,
        "name": "British Virgin Islands",
        "isoCode": "VG",
        "iso3Code": "VGB",
        "phoneNumberPrefix": "+1-284"
    }, {
        "id": 117,
        "name": "Slovakia",
        "isoCode": "SK",
        "iso3Code": "SVK",
        "phoneNumberPrefix": "421"
    }, {
        "id": 118,
        "name": "Poland",
        "isoCode": "PL",
        "iso3Code": "POL",
        "phoneNumberPrefix": "48"
    }, {
        "id": 119,
        "name": "Bhutan",
        "isoCode": "BT",
        "iso3Code": "BTN",
        "phoneNumberPrefix": "975"
    }, {
        "id": 120,
        "name": "East Timor",
        "isoCode": "TL",
        "iso3Code": "TLS",
        "phoneNumberPrefix": "670"
    }, {
        "id": 121,
        "name": "Japan",
        "isoCode": "JP",
        "iso3Code": "JPN",
        "phoneNumberPrefix": "81"
    }, {
        "id": 122,
        "name": "Italy",
        "isoCode": "IT",
        "iso3Code": "ITA",
        "phoneNumberPrefix": "39"
    }, {
        "id": 123,
        "name": "Northern Mariana Islands",
        "isoCode": "MP",
        "iso3Code": "MNP",
        "phoneNumberPrefix": "+1-670"
    }, {
        "id": 124,
        "name": "Mayotte",
        "isoCode": "YT",
        "iso3Code": "MYT",
        "phoneNumberPrefix": "262"
    }, {
        "id": 125,
        "name": "Norfolk Island",
        "isoCode": "NF",
        "iso3Code": "NFK",
        "phoneNumberPrefix": "672"
    }, {
        "id": 126,
        "name": "Macedonia",
        "isoCode": "MK",
        "iso3Code": "MKD",
        "phoneNumberPrefix": "389"
    }, {
        "id": 127,
        "name": "Norway",
        "isoCode": "NO",
        "iso3Code": "NOR",
        "phoneNumberPrefix": "47"
    }, {
        "id": 128,
        "name": "Azerbaijan",
        "isoCode": "AZ",
        "iso3Code": "AZE",
        "phoneNumberPrefix": "994"
    }, {
        "id": 129,
        "name": "Democratic Republic of the Congo",
        "isoCode": "CD",
        "iso3Code": "COD",
        "phoneNumberPrefix": "243"
    }, {
        "id": 130,
        "name": "Tokelau",
        "isoCode": "TK",
        "iso3Code": "TKL",
        "phoneNumberPrefix": "690"
    }, {
        "id": 131,
        "name": "Costa Rica",
        "isoCode": "CR",
        "iso3Code": "CRI",
        "phoneNumberPrefix": "506"
    }, {
        "id": 132,
        "name": "Palau",
        "isoCode": "PW",
        "iso3Code": "PLW",
        "phoneNumberPrefix": "680"
    }, {
        "id": 133,
        "name": "Reunion",
        "isoCode": "RE",
        "iso3Code": "REU",
        "phoneNumberPrefix": "262"
    }, {
        "id": 134,
        "name": "Thailand",
        "isoCode": "TH",
        "iso3Code": "THA",
        "phoneNumberPrefix": "66"
    }, {
        "id": 135,
        "name": "Tuvalu",
        "isoCode": "TV",
        "iso3Code": "TUV",
        "phoneNumberPrefix": "688"
    }, {
        "id": 136,
        "name": "Kazakhstan",
        "isoCode": "KZ",
        "iso3Code": "KAZ",
        "phoneNumberPrefix": "7"
    }, {
        "id": 137,
        "name": "Jamaica",
        "isoCode": "JM",
        "iso3Code": "JAM",
        "phoneNumberPrefix": "+1-876"
    }, {
        "id": 138,
        "name": "Ghana",
        "isoCode": "GH",
        "iso3Code": "GHA",
        "phoneNumberPrefix": "233"
    }, {
        "id": 139,
        "name": "Tajikistan",
        "isoCode": "TJ",
        "iso3Code": "TJK",
        "phoneNumberPrefix": "992"
    }, {
        "id": 140,
        "name": "Micronesia",
        "isoCode": "FM",
        "iso3Code": "FSM",
        "phoneNumberPrefix": "691"
    }, {
        "id": 141,
        "name": "Guinea",
        "isoCode": "GN",
        "iso3Code": "GIN",
        "phoneNumberPrefix": "224"
    }, {
        "id": 142,
        "name": "Madagascar",
        "isoCode": "MG",
        "iso3Code": "MDG",
        "phoneNumberPrefix": "261"
    }, {
        "id": 143,
        "name": "Tanzania",
        "isoCode": "TZ",
        "iso3Code": "TZA",
        "phoneNumberPrefix": "255"
    }, {
        "id": 144,
        "name": "Saudi Arabia",
        "isoCode": "SA",
        "iso3Code": "SAU",
        "phoneNumberPrefix": "966"
    }, {
        "id": 145,
        "name": "Luxembourg",
        "isoCode": "LU",
        "iso3Code": "LUX",
        "phoneNumberPrefix": "352"
    }, {
        "id": 146,
        "name": "Nepal",
        "isoCode": "NP",
        "iso3Code": "NPL",
        "phoneNumberPrefix": "977"
    }, {
        "id": 147,
        "name": "Montenegro",
        "isoCode": "ME",
        "iso3Code": "MNE",
        "phoneNumberPrefix": "382"
    }, {
        "id": 148,
        "name": "Ivory Coast",
        "isoCode": "CI",
        "iso3Code": "CIV",
        "phoneNumberPrefix": "225"
    }, {
        "id": 149,
        "name": "Christmas Island",
        "isoCode": "CX",
        "iso3Code": "CXR",
        "phoneNumberPrefix": "61"
    }, {
        "id": 150,
        "name": "Montserrat",
        "isoCode": "MS",
        "iso3Code": "MSR",
        "phoneNumberPrefix": "+1-664"
    }, {
        "id": 151,
        "name": "Aland Islands",
        "isoCode": "AX",
        "iso3Code": "ALA",
        "phoneNumberPrefix": "+358-18"
    }, {
        "id": 152,
        "name": "South Africa",
        "isoCode": "ZA",
        "iso3Code": "ZAF",
        "phoneNumberPrefix": "27"
    }, {
        "id": 153,
        "name": "Panama",
        "isoCode": "PA",
        "iso3Code": "PAN",
        "phoneNumberPrefix": "507"
    }, {
        "id": 154,
        "name": "Saint Helena",
        "isoCode": "SH",
        "iso3Code": "SHN",
        "phoneNumberPrefix": "290"
    }, {
        "id": 155,
        "name": "Switzerland",
        "isoCode": "CH",
        "iso3Code": "CHE",
        "phoneNumberPrefix": "41"
    }, {
        "id": 156,
        "name": "Anguilla",
        "isoCode": "AI",
        "iso3Code": "AIA",
        "phoneNumberPrefix": "+1-264"
    }, {
        "id": 157,
        "name": "Kenya",
        "isoCode": "KE",
        "iso3Code": "KEN",
        "phoneNumberPrefix": "254"
    }, {
        "id": 158,
        "name": "Honduras",
        "isoCode": "HN",
        "iso3Code": "HND",
        "phoneNumberPrefix": "504"
    }, {
        "id": 159,
        "name": "Mauritius",
        "isoCode": "MU",
        "iso3Code": "MUS",
        "phoneNumberPrefix": "230"
    }, {
        "id": 160,
        "name": "Kosovo",
        "isoCode": "XK",
        "iso3Code": "XKX",
        "phoneNumberPrefix": ""
    }, {
        "id": 161,
        "name": "Australia",
        "isoCode": "AU",
        "iso3Code": "AUS",
        "phoneNumberPrefix": "61"
    }, {
        "id": 162,
        "name": "Brunei",
        "isoCode": "BN",
        "iso3Code": "BRN",
        "phoneNumberPrefix": "673"
    }, {
        "id": 163,
        "name": "Nigeria",
        "isoCode": "NG",
        "iso3Code": "NGA",
        "phoneNumberPrefix": "234"
    }, {
        "id": 164,
        "name": "Central African Republic",
        "isoCode": "CF",
        "iso3Code": "CAF",
        "phoneNumberPrefix": "236"
    }, {
        "id": 165,
        "name": "Sao Tome and Principe",
        "isoCode": "ST",
        "iso3Code": "STP",
        "phoneNumberPrefix": "239"
    }, {
        "id": 166,
        "name": "Croatia",
        "isoCode": "HR",
        "iso3Code": "HRV",
        "phoneNumberPrefix": "385"
    }, {
        "id": 167,
        "name": "Ecuador",
        "isoCode": "EC",
        "iso3Code": "ECU",
        "phoneNumberPrefix": "593"
    }, {
        "id": 168,
        "name": "Spain",
        "isoCode": "ES",
        "iso3Code": "ESP",
        "phoneNumberPrefix": "34"
    }, {
        "id": 169,
        "name": "Zimbabwe",
        "isoCode": "ZW",
        "iso3Code": "ZWE",
        "phoneNumberPrefix": "263"
    }, {
        "id": 170,
        "name": "New Caledonia",
        "isoCode": "NC",
        "iso3Code": "NCL",
        "phoneNumberPrefix": "687"
    }, {
        "id": 171,
        "name": "Algeria",
        "isoCode": "DZ",
        "iso3Code": "DZA",
        "phoneNumberPrefix": "213"
    }, {
        "id": 172,
        "name": "U.S. Virgin Islands",
        "isoCode": "VI",
        "iso3Code": "VIR",
        "phoneNumberPrefix": "+1-340"
    }, {
        "id": 173,
        "name": "China",
        "isoCode": "CN",
        "iso3Code": "CHN",
        "phoneNumberPrefix": "86"
    }, {
        "id": 174,
        "name": "Marshall Islands",
        "isoCode": "MH",
        "iso3Code": "MHL",
        "phoneNumberPrefix": "692"
    }, {
        "id": 175,
        "name": "Bolivia",
        "isoCode": "BO",
        "iso3Code": "BOL",
        "phoneNumberPrefix": "591"
    }, {
        "id": 176,
        "name": "Peru",
        "isoCode": "PE",
        "iso3Code": "PER",
        "phoneNumberPrefix": "51"
    }, {
        "id": 177,
        "name": "Svalbard and Jan Mayen",
        "isoCode": "SJ",
        "iso3Code": "SJM",
        "phoneNumberPrefix": "47"
    }, {
        "id": 178,
        "name": "Singapore",
        "isoCode": "SG",
        "iso3Code": "SGP",
        "phoneNumberPrefix": "65"
    }, {
        "id": 179,
        "name": "Estonia",
        "isoCode": "EE",
        "iso3Code": "EST",
        "phoneNumberPrefix": "372"
    }, {
        "id": 180,
        "name": "Tunisia",
        "isoCode": "TN",
        "iso3Code": "TUN",
        "phoneNumberPrefix": "216"
    }, {
        "id": 181,
        "name": "Romania",
        "isoCode": "RO",
        "iso3Code": "ROU",
        "phoneNumberPrefix": "40"
    }, {
        "id": 182,
        "name": "Ethiopia",
        "isoCode": "ET",
        "iso3Code": "ETH",
        "phoneNumberPrefix": "251"
    }, {
        "id": 183,
        "name": "Martinique",
        "isoCode": "MQ",
        "iso3Code": "MTQ",
        "phoneNumberPrefix": "596"
    }, {
        "id": 184,
        "name": "Saint Kitts and Nevis",
        "isoCode": "KN",
        "iso3Code": "KNA",
        "phoneNumberPrefix": "+1-869"
    }, {
        "id": 185,
        "name": "Cayman Islands",
        "isoCode": "KY",
        "iso3Code": "CYM",
        "phoneNumberPrefix": "+1-345"
    }, {
        "id": 186,
        "name": "Cameroon",
        "isoCode": "CM",
        "iso3Code": "CMR",
        "phoneNumberPrefix": "237"
    }, {
        "id": 187,
        "name": "San Marino",
        "isoCode": "SM",
        "iso3Code": "SMR",
        "phoneNumberPrefix": "378"
    }, {
        "id": 188,
        "name": "New Zealand",
        "isoCode": "NZ",
        "iso3Code": "NZL",
        "phoneNumberPrefix": "64"
    }, {
        "id": 189,
        "name": "Mongolia",
        "isoCode": "MN",
        "iso3Code": "MNG",
        "phoneNumberPrefix": "976"
    }, {
        "id": 190,
        "name": "Finland",
        "isoCode": "FI",
        "iso3Code": "FIN",
        "phoneNumberPrefix": "358"
    }, {
        "id": 191,
        "name": "Guinea-Bissau",
        "isoCode": "GW",
        "iso3Code": "GNB",
        "phoneNumberPrefix": "245"
    }, {
        "id": 192,
        "name": "Taiwan",
        "isoCode": "TW",
        "iso3Code": "TWN",
        "phoneNumberPrefix": "886"
    }, {
        "id": 193,
        "name": "Iceland",
        "isoCode": "IS",
        "iso3Code": "ISL",
        "phoneNumberPrefix": "354"
    }, {
        "id": 194,
        "name": "Lithuania",
        "isoCode": "LT",
        "iso3Code": "LTU",
        "phoneNumberPrefix": "370"
    }, {
        "id": 195,
        "name": "Mali",
        "isoCode": "ML",
        "iso3Code": "MLI",
        "phoneNumberPrefix": "223"
    }, {
        "id": 196,
        "name": "Greece",
        "isoCode": "GR",
        "iso3Code": "GRC",
        "phoneNumberPrefix": "30"
    }, {
        "id": 197,
        "name": "Sint Maarten",
        "isoCode": "SX",
        "iso3Code": "SXM",
        "phoneNumberPrefix": "599"
    }, {
        "id": 198,
        "name": "Namibia",
        "isoCode": "NA",
        "iso3Code": "NAM",
        "phoneNumberPrefix": "264"
    }, {
        "id": 199,
        "name": "Guatemala",
        "isoCode": "GT",
        "iso3Code": "GTM",
        "phoneNumberPrefix": "502"
    }, {
        "id": 200,
        "name": "Curacao",
        "isoCode": "CW",
        "iso3Code": "CUW",
        "phoneNumberPrefix": "599"
    }, {
        "id": 201,
        "name": "Mozambique",
        "isoCode": "MZ",
        "iso3Code": "MOZ",
        "phoneNumberPrefix": "258"
    }, {
        "id": 202,
        "name": "Armenia",
        "isoCode": "AM",
        "iso3Code": "ARM",
        "phoneNumberPrefix": "374"
    }, {
        "id": 203,
        "name": "South Sudan",
        "isoCode": "SS",
        "iso3Code": "SSD",
        "phoneNumberPrefix": "211"
    }, {
        "id": 204,
        "name": "Hong Kong",
        "isoCode": "HK",
        "iso3Code": "HKG",
        "phoneNumberPrefix": "852"
    }, {
        "id": 205,
        "name": "Nauru",
        "isoCode": "NR",
        "iso3Code": "NRU",
        "phoneNumberPrefix": "674"
    }, {
        "id": 206,
        "name": "Saint Barthelemy",
        "isoCode": "BL",
        "iso3Code": "BLM",
        "phoneNumberPrefix": "590"
    }, {
        "id": 207,
        "name": "Palestinian Territory",
        "isoCode": "PS",
        "iso3Code": "PSE",
        "phoneNumberPrefix": "970"
    }, {
        "id": 208,
        "name": "Denmark",
        "isoCode": "DK",
        "iso3Code": "DNK",
        "phoneNumberPrefix": "45"
    }, {
        "id": 209,
        "name": "Botswana",
        "isoCode": "BW",
        "iso3Code": "BWA",
        "phoneNumberPrefix": "267"
    }, {
        "id": 210,
        "name": "Gambia",
        "isoCode": "GM",
        "iso3Code": "GMB",
        "phoneNumberPrefix": "220"
    }, {
        "id": 211,
        "name": "Sri Lanka",
        "isoCode": "LK",
        "iso3Code": "LKA",
        "phoneNumberPrefix": "94"
    }, {
        "id": 212,
        "name": "Comoros",
        "isoCode": "KM",
        "iso3Code": "COM",
        "phoneNumberPrefix": "269"
    }, {
        "id": 213,
        "name": "Rwanda",
        "isoCode": "RW",
        "iso3Code": "RWA",
        "phoneNumberPrefix": "250"
    }, {
        "id": 214,
        "name": "Bangladesh",
        "isoCode": "BD",
        "iso3Code": "BGD",
        "phoneNumberPrefix": "880"
    }, {
        "id": 215,
        "name": "Cocos Islands",
        "isoCode": "CC",
        "iso3Code": "CCK",
        "phoneNumberPrefix": "61"
    }, {
        "id": 216,
        "name": "Myanmar",
        "isoCode": "MM",
        "iso3Code": "MMR",
        "phoneNumberPrefix": "95"
    }, {
        "id": 217,
        "name": "Afghanistan",
        "isoCode": "AF",
        "iso3Code": "AFG",
        "phoneNumberPrefix": "93"
    }, {
        "id": 218,
        "name": "France",
        "isoCode": "FR",
        "iso3Code": "FRA",
        "phoneNumberPrefix": "33"
    }, {
        "id": 219,
        "name": "Tonga",
        "isoCode": "TO",
        "iso3Code": "TON",
        "phoneNumberPrefix": "676"
    }, {
        "id": 220,
        "name": "Cook Islands",
        "isoCode": "CK",
        "iso3Code": "COK",
        "phoneNumberPrefix": "682"
    }, {
        "id": 221,
        "name": "Benin",
        "isoCode": "BJ",
        "iso3Code": "BEN",
        "phoneNumberPrefix": "229"
    }, {
        "id": 222,
        "name": "Kiribati",
        "isoCode": "KI",
        "iso3Code": "KIR",
        "phoneNumberPrefix": "686"
    }, {
        "id": 223,
        "name": "Serbia",
        "isoCode": "RS",
        "iso3Code": "SRB",
        "phoneNumberPrefix": "381"
    }, {
        "id": 224,
        "name": "Aruba",
        "isoCode": "AW",
        "iso3Code": "ABW",
        "phoneNumberPrefix": "297"
    }, {
        "id": 225,
        "name": "Canada",
        "isoCode": "CA",
        "iso3Code": "CAN",
        "phoneNumberPrefix": "1"
    }, {
        "id": 226,
        "name": "Isle of Man",
        "isoCode": "IM",
        "iso3Code": "IMN",
        "phoneNumberPrefix": "+44-1624"
    }, {
        "id": 227,
        "name": "Faroe Islands",
        "isoCode": "FO",
        "iso3Code": "FRO",
        "phoneNumberPrefix": "298"
    }, {
        "id": 228,
        "name": "Chile",
        "isoCode": "CL",
        "iso3Code": "CHL",
        "phoneNumberPrefix": "56"
    }, {
        "id": 229,
        "name": "Cyprus",
        "isoCode": "CY",
        "iso3Code": "CYP",
        "phoneNumberPrefix": "357"
    }, {
        "id": 230,
        "name": "Cuba",
        "isoCode": "CU",
        "iso3Code": "CUB",
        "phoneNumberPrefix": "53"
    }, {
        "id": 231,
        "name": "Burkina Faso",
        "isoCode": "BF",
        "iso3Code": "BFA",
        "phoneNumberPrefix": "226"
    }, {
        "id": 232,
        "name": "Seychelles",
        "isoCode": "SC",
        "iso3Code": "SYC",
        "phoneNumberPrefix": "248"
    }, {
        "id": 233,
        "name": "Dominican Republic",
        "isoCode": "DO",
        "iso3Code": "DOM",
        "phoneNumberPrefix": "+1-809"
    }, {
        "id": 234,
        "name": "Bouvet Island",
        "isoCode": "BV",
        "iso3Code": "BVT",
        "phoneNumberPrefix": ""
    }, {
        "id": 235,
        "name": "Maldives",
        "isoCode": "MV",
        "iso3Code": "MDV",
        "phoneNumberPrefix": "960"
    }, {
        "id": 236,
        "name": "Zambia",
        "isoCode": "ZM",
        "iso3Code": "ZMB",
        "phoneNumberPrefix": "260"
    }, {
        "id": 237,
        "name": "Turkey",
        "isoCode": "TR",
        "iso3Code": "TUR",
        "phoneNumberPrefix": "90"
    }, {
        "id": 238,
        "name": "Guadeloupe",
        "isoCode": "GP",
        "iso3Code": "GLP",
        "phoneNumberPrefix": "590"
    }, {
        "id": 239,
        "name": "Barbados",
        "isoCode": "BB",
        "iso3Code": "BRB",
        "phoneNumberPrefix": "+1-246"
    }, {
        "id": 240,
        "name": "Austria",
        "isoCode": "AT",
        "iso3Code": "AUT",
        "phoneNumberPrefix": "43"
    }, {
        "id": 241,
        "name": "Oman",
        "isoCode": "OM",
        "iso3Code": "OMN",
        "phoneNumberPrefix": "968"
    }, {
        "id": 242,
        "name": "Vietnam",
        "isoCode": "VN",
        "iso3Code": "VNM",
        "phoneNumberPrefix": "84"
    }, {
        "id": 243,
        "name": "Vanuatu",
        "isoCode": "VU",
        "iso3Code": "VUT",
        "phoneNumberPrefix": "678"
    }, {
        "id": 244,
        "name": "Andorra",
        "isoCode": "AD",
        "iso3Code": "AND",
        "phoneNumberPrefix": "376"
    }, {
        "id": 245,
        "name": "Togo",
        "isoCode": "TG",
        "iso3Code": "TGO",
        "phoneNumberPrefix": "228"
    }, {
        "id": 246,
        "name": "Russia",
        "isoCode": "RU",
        "iso3Code": "RUS",
        "phoneNumberPrefix": "7"
    }, {
        "id": 247,
        "name": "Dominica",
        "isoCode": "DM",
        "iso3Code": "DMA",
        "phoneNumberPrefix": "+1-767"
    }, {
        "id": 248,
        "name": "Morocco",
        "isoCode": "MA",
        "iso3Code": "MAR",
        "phoneNumberPrefix": "212"
    }, {
        "id": 249,
        "name": "Moldova",
        "isoCode": "MD",
        "iso3Code": "MDA",
        "phoneNumberPrefix": "373"
    }, {
        "id": 250,
        "name": "Liberia",
        "isoCode": "LR",
        "iso3Code": "LBR",
        "phoneNumberPrefix": "231"
    }],
    "Tag": [{
        "id": 2,
        "name": "Strings"
    }, {
        "id": 3,
        "name": "Sorting"
    }, {
        "id": 4,
        "name": "Math"
    }, {
        "id": 5,
        "name": "Permutation",
        "parentId": 4
    }, {
        "id": 6,
        "name": "Greedy"
    }, {
        "id": 7,
        "name": "Dynamic Programming"
    }, {
        "id": 8,
        "name": "Ad Hoc"
    }, {
        "id": 10,
        "name": "Data Structures"
    }, {
        "id": 12,
        "name": "Binary Search"
    }, {
        "id": 13,
        "name": "Binary Search Tree",
        "parentId": 10
    }, {
        "id": 14,
        "name": "Combinatorics",
        "parentId": 4
    }, {
        "id": 15,
        "name": "Greatest Common Divisor",
        "parentId": 4
    }, {
        "id": 16,
        "name": "Implementation"
    }, {
        "id": 17,
        "name": "Median",
        "parentId": 3
    }, {
        "id": 18,
        "name": "Bits"
    }, {
        "id": 19,
        "name": "Gray Codes",
        "parentId": 18
    }, {
        "id": 20,
        "name": "Tree Dynamic Programming",
        "parentId": 7
    }, {
        "id": 21,
        "name": "Iteration"
    }, {
        "id": 22,
        "name": "Two Pointers",
        "parentId": 21
    }, {
        "id": 9,
        "name": "Sweep Line (Iteration)",
        "parentId": 21
    }, {
        "id": 23,
        "name": "Game Theory"
    }, {
        "id": 24,
        "name": "Nim",
        "parentId": 23
    }, {
        "id": 25,
        "name": "Hashing",
        "parentId": 10
    }, {
        "id": 26,
        "name": "Recursion"
    }, {
        "id": 27,
        "name": "Fenwick Tree",
        "parentId": 10
    }, {
        "id": 28,
        "name": "Trie",
        "parentId": 10
    }, {
        "id": 29,
        "name": "Graphs"
    }, {
        "id": 30,
        "name": "BFS",
        "parentId": 29
    }, {
        "id": 31,
        "name": "Geometry"
    }, {
        "id": 32,
        "name": "KMP",
        "parentId": 2
    }, {
        "id": 34,
        "name": "Longest Common Prefix",
        "parentId": 2
    }, {
        "id": 35,
        "name": "Longest Common Suffix",
        "parentId": 2
    }, {
        "id": 36,
        "name": "Sprague Grundy",
        "parentId": 23
    }, {
        "id": 37,
        "name": "Heap",
        "parentId": 10
    }, {
        "id": 38,
        "name": "Constructive Algorithms"
    }, {
        "id": 39,
        "name": "Gaussian Elimination",
        "parentId": 4
    }, {
        "id": 40,
        "name": "Bitset",
        "parentId": 18
    }, {
        "id": 41,
        "name": "Dijkstra",
        "parentId": 29
    }, {
        "id": 42,
        "name": "Sieve of Eratosthenes",
        "parentId": 4
    }, {
        "id": 43,
        "name": "Matrix Exponentiation",
        "parentId": 7
    }, {
        "id": 44,
        "name": "Deque",
        "parentId": 10
    }, {
        "id": 45,
        "name": "Sweep Line (Geometry)",
        "parentId": 31
    }, {
        "id": 46,
        "name": "Trees"
    }, {
        "id": 47,
        "name": "Lowest Common Ancestor",
        "parentId": 46
    }, {
        "id": 48,
        "name": "Exponential States",
        "parentId": 7
    }, {
        "id": 49,
        "name": "Burnside's Lemma",
        "parentId": 4
    }, {
        "id": 50,
        "name": "Backtracking"
    }, {
        "id": 51,
        "name": "Strongly Connected Components",
        "parentId": 29
    }, {
        "id": 52,
        "name": "Topological Sorting",
        "parentId": 29
    }, {
        "id": 53,
        "name": "Segment Tree",
        "parentId": 10
    }, {
        "id": 54,
        "name": "Divide and Conquer"
    }, {
        "id": 55,
        "name": "Hashmap",
        "parentId": 10
    }, {
        "id": 56,
        "name": "Disjoint Sets",
        "parentId": 10
    }, {
        "id": 57,
        "name": "FFT",
        "parentId": 4
    }, {
        "id": 58,
        "name": "Linked Lists",
        "parentId": 10
    }, {
        "id": 59,
        "name": "Expected Value",
        "parentId": 4
    }, {
        "id": 60,
        "name": "Sqrt Decomposition"
    }, {
        "id": 61,
        "name": "Convex Hull",
        "parentId": 31
    }, {
        "id": 62,
        "name": "Ternary Search"
    }, {
        "id": 63,
        "name": "DFS",
        "parentId": 29
    }, {
        "id": 64,
        "name": "Z Algorithm",
        "parentId": 2
    }, {
        "id": 11,
        "name": "Stack",
        "parentId": 10
    }, {
        "id": 65,
        "name": "Bitwise Operations",
        "parentId": 18
    }, {
        "id": 33,
        "name": "Maximum Independent Set",
        "parentId": 29
    }, {
        "id": 66,
        "name": "Pigeonhole Principle",
        "parentId": 4
    }, {
        "id": 67,
        "name": "Range Minimum Query",
        "parentId": 10
    }, {
        "id": 68,
        "name": "Flood Fill",
        "parentId": 29
    }, {
        "id": 69,
        "name": "Interactive"
    }, {
        "id": 70,
        "name": "Adaptive",
        "parentId": 69
    }, {
        "id": 71,
        "name": "Enforced Template"
    }, {
        "id": 72,
        "name": "Maximum Matching",
        "parentId": 29
    }, {
        "id": 73,
        "name": "Maximum Flow",
        "parentId": 29
    }, {
        "id": 74,
        "name": "Centroid Decomposition",
        "parentId": 46
    }, {
        "id": 75,
        "name": "Output Only"
    }, {
        "id": 76,
        "name": "Kruskal",
        "parentId": 29
    }],
    "AceTheme": [{
        "id": 1,
        "name": "Dawn",
        "aceName": "dawn"
    }, {
        "id": 2,
        "name": "XCode",
        "aceName": "xcode"
    }, {
        "id": 3,
        "name": "Dark",
        "aceName": "idle_fingers"
    }],
    "AceEditorKeyboardHandler": [{
        "id": 1,
        "name": "Default",
        "aceName": "ace"
    }, {
        "id": 2,
        "name": "Vim",
        "aceName": "vim"
    }, {
        "id": 3,
        "name": "Emacs",
        "aceName": "emacs"
    }],
    "programminglanguage": [{
        "id": 10,
        "name": "Ruby",
        "isCompiled": false,
        "extension": "rb",
        "aceMode": "ruby",
        "defaultSource": "a = gets.to_i\r\nb = gets.to_i\r\nsum = a + b\r\nprint (sum)",
        "timeRatio": 2.5,
        "extraTime": 20.0
    }, {
        "id": 15,
        "name": "Smalltalk",
        "isCompiled": false,
        "extension": "st",
        "aceMode": "smalltalk",
        "defaultSource": "input := stdin.\r\n[input atEnd] whileFalse: [\r\n    a:= input nextLine asInteger.\r\n    b:= input nextLine asInteger.\r\n    res := a + b\r\n].\r\n(res) printNl"
    }, {
        "id": 5,
        "name": "C#",
        "isCompiled": true,
        "extension": "cs",
        "aceMode": "csharp",
        "defaultSource": "using System;\r\nusing System.Collections.Generic;\r\nusing System.IO;\r\n\r\nclass Solution {\r\n    static void Main(String[] args) {\r\n        int val1 = Convert.ToInt32(Console.ReadLine());\r\n        int val2 = Convert.ToInt32(Console.ReadLine());\r\n        int sum = val1 + val2;\r\n        Console.WriteLine(sum);\r\n    }\r\n}",
        "timeRatio": 1.2,
        "extraTime": 20.0,
        "extraMemory": 2560
    }, {
        "id": 16,
        "name": "OCaml",
        "isCompiled": true,
        "extension": "ml",
        "aceMode": "ocaml",
        "defaultSource": "let sum a b = a + b\r\n\r\nlet () =\r\n    Printf.printf \"%i\\n\" ((Scanf.scanf \"%i %i\" sum))"
    }, {
        "id": 9,
        "name": "Lua",
        "isCompiled": false,
        "extension": "lua",
        "aceMode": "lua",
        "defaultSource": "a = io.read(\"*number\")\r\nb = io.read(\"*number\")\r\nres = a + b\r\nprint (res)",
        "extraTime": 20.0
    }, {
        "id": 8,
        "name": "Fortran",
        "isCompiled": true,
        "extension": "f",
        "aceMode": "fortran",
        "defaultSource": "PROGRAM main\r\n    IMPLICIT NONE\r\n    \r\n    INTEGER :: a\r\n    INTEGER :: b\r\n    \r\n    READ(*,*) a\r\n    READ(*,*) b\r\n    WRITE(*,'(i0)') a + b\r\nEND PROGRAM main"
    }, {
        "id": 11,
        "name": "Perl",
        "isCompiled": false,
        "extension": "pl",
        "aceMode": "perl",
        "defaultSource": "$a = <STDIN> ;\r\n$b = <STDIN> ;\r\n$res = $a + $b;\r\nprint \"$res\";",
        "extraTime": 20.0
    }, {
        "id": 19,
        "name": "Ada",
        "isCompiled": true,
        "extension": "adb",
        "aceMode": "ada",
        "defaultSource": "with Ada.Text_IO, Ada.Integer_Text_IO, Ada.Float_Text_IO;\r\nuse Ada.Text_IO, Ada.Integer_Text_IO, Ada.Float_Text_IO;\r\nprocedure Main is\r\n\r\na, b, sum: Integer;\r\nbegin\r\n    Get (a); \r\n    Get (b);\r\n    sum := a+b;  \r\n    Put (sum, Width => 1);\r\n\r\nend Main;"
    }, {
        "id": 24,
        "name": "Octave",
        "isCompiled": false,
        "extension": "m",
        "aceMode": "octave",
        "defaultSource": "a = input(\"\");\r\nb = input(\"\");\r\nprintf(\"%d\", a+b);"
    }, {
        "id": 23,
        "name": "Tcl",
        "isCompiled": true,
        "extension": "tcsh",
        "aceMode": "tcl",
        "defaultSource": "proc sum {a b} {\r\n    expr {$a+$b}\r\n}\r\n\r\nset a [gets stdin]\r\nset b [gets stdin]\r\nset res [sum $a $b]\r\nputs $res"
    }, {
        "id": 3,
        "name": "Python 2",
        "isCompiled": true,
        "extension": "py",
        "aceMode": "python",
        "defaultSource": "num1 = input()\r\nnum2 = input()\r\nres = num1 + num2\r\nprint res",
        "timeRatio": 2.5
    }, {
        "id": 13,
        "name": "C",
        "isCompiled": true,
        "extension": "c",
        "aceMode": "c_cpp",
        "defaultSource": "#include <stdio.h>\r\n\r\nint main() {\r\n    int a, b;\r\n    scanf(\"%d %d\", &a, &b);\r\n    printf(\"%d\", a + b);\r\n    return 0;\r\n}"
    }, {
        "id": 18,
        "name": "COBOL",
        "isCompiled": true,
        "extension": "cbl",
        "aceMode": "cobol",
        "defaultSource": "IDENTIFICATION DIVISION.\r\nPROGRAM-ID. CSA.\r\n\r\nENVIRONMENT DIVISION.\r\n\r\nDATA DIVISION.\r\nWORKING-STORAGE SECTION.\r\n77 A PIC 9999.\r\n77 B PIC 9999.\r\n77 ANS PIC 999v99.\r\n\r\nPROCEDURE DIVISION.\r\nMAIN-PARA.\r\n   ACCEPT A.\r\n   ACCEPT B.\r\n\r\nADD-PARA.\r\n   ADD A B GIVING ANS. \r\n\r\nDISP-PARA.\r\n   DISPLAY ANS.\r\n   STOP RUN."
    }, {
        "id": 12,
        "name": "PHP",
        "isCompiled": false,
        "extension": "php",
        "aceMode": "php",
        "defaultSource": "<?php\r\n$handle = fopen (\"php://stdin\",\"r\");\r\n$a = fgets($handle);\r\n$b = fgets($handle);\r\n$sum = $a + $b;\r\nprint ($sum);\r\nfclose($handle);\r\n?>",
        "extraTime": 20.0
    }, {
        "id": 14,
        "name": "Objective-C",
        "isCompiled": true,
        "extension": "m",
        "aceMode": "objectivec",
        "defaultSource": "#import <Foundation/Foundation.h>\r\n \r\nint main (int argc, const char * argv[]) {\r\n    NSAutoreleasePool *pool = [[NSAutoreleasePool alloc] init];\r\n    int a,b,res;\r\n    scanf(\"%d %d\", &a, &b);\r\n    res = a + b;\r\n    printf(\"%d\", res);\r\n    [pool drain];\r\n    return 0;\r\n}"
    }, {
        "id": 2,
        "name": "Java",
        "isCompiled": true,
        "extension": "java",
        "aceMode": "java",
        "defaultSource": "// Don't place your source in a package\r\nimport java.util.*;\r\nimport java.lang.*;\r\nimport java.io.*;\r\n\r\n// Please name your class Main\r\nclass Main {\r\n\tpublic static void main (String[] args) throws java.lang.Exception {\r\n\t    Scanner in = new Scanner(System.in);\r\n\t\tint a = in.nextInt();\r\n\t\tint b = in.nextInt();\r\n\t\tSystem.out.print(a + b);\r\n\t}\r\n}",
        "timeRatio": 1.2,
        "extraTime": 80.0,
        "extraMemory": 8192
    }, {
        "id": 4,
        "name": "Python 3",
        "isCompiled": true,
        "extension": "py",
        "aceMode": "python",
        "defaultSource": "# a simple parser for python. use get_number() and get_word() to read\r\ndef parser():\r\n    while 1:\r\n        data = list(input().split(' '))\r\n        for number in data:\r\n            if len(number) > 0:\r\n                yield(number)   \r\n\r\ninput_parser = parser()\r\n\r\ndef get_word():\r\n    global input_parser\r\n    return next(input_parser)\r\n\r\ndef get_number():\r\n    data = get_word()\r\n    try:\r\n        return int(data)\r\n    except ValueError:\r\n        return float(data)\r\n\r\n# numpy and scipy are available for use\r\nimport numpy\r\nimport scipy\r\n\r\na = get_number()\r\nb = get_number()\r\n\r\nres = a + b\r\nprint(res)",
        "timeRatio": 2.5
    }, {
        "id": 20,
        "name": "Pascal",
        "isCompiled": true,
        "extension": "pas",
        "aceMode": "pascal",
        "defaultSource": "Program Main;\r\n\r\nvar A : integer;\r\n    B : integer;\r\n    Res : integer;\r\nbegin\r\n  Readln(A, B);\r\n  Res := A + B;\r\n  WriteLn(Res);\r\nend."
    }, {
        "id": 21,
        "name": "Common LISP",
        "isCompiled": false,
        "extension": "lisp",
        "aceMode": "lisp",
        "defaultSource": "(defun add (x y)\r\n     (+ x y))\r\n    \r\n(setq a (read-line))\r\n(setq b (read-line))\r\n\r\n(write (add (parse-integer a) (parse-integer b)))"
    }, {
        "id": 6,
        "name": "Haskell",
        "isCompiled": true,
        "extension": "hs",
        "aceMode": "haskell",
        "defaultSource": "-- the available packages are vector containers unordered-containers vector-algorithms\r\n-- if you have any suggestions for aditional packages message alex.velea\r\n\r\nadd a b = a + b\r\n\r\nmain = do\r\n    val1 <- readLn\r\n    val2 <- readLn\r\n    let sum = add val1 val2\r\n    print sum",
        "extraTime": 20.0
    }, {
        "id": 7,
        "name": "BASH",
        "isCompiled": true,
        "extension": "sh",
        "aceMode": "sh",
        "defaultSource": "read a\r\nread b\r\necho $(($a + $b))",
        "extraTime": 20.0
    }, {
        "id": 1,
        "name": "C++",
        "isCompiled": true,
        "extension": "cpp",
        "aceMode": "c_cpp",
        "defaultSource": "#include <iostream>\r\n\r\nusing namespace std;\r\n\r\nint main() {\r\n    int a, b;\r\n    cin >> a >> b;\r\n    cout << a + b;\r\n    return 0;\r\n}"
    }, {
        "id": 22,
        "name": "Erlang",
        "isCompiled": true,
        "extension": "erl",
        "aceMode": "erlang",
        "defaultSource": "-module(main).\r\n-export([start/0]).\r\n\r\nstart() -> \r\n    {ok, [A, B]} = io:fread(\"\", \"~d~d\"),\r\n    Res = A + B,\r\n    io:format(\"~p~n\",[Res])."
    }, {
        "id": 17,
        "name": "Javascript",
        "isCompiled": true,
        "extension": "js",
        "aceMode": "javascript",
        "defaultSource": "function main() {\r\n    // write your code here.\r\n    // call functions `nextString`, `nextFloat` and `nextInt` \r\n    // to read the next token of input (ignoring whitespace)\r\n    // Alternatively, you can create your own input parser functions\r\n    // use console.log() to write to stdout\r\n\r\n    var i = nextInt();\r\n    var s = nextString();\r\n    var c = nextChar();\r\n    var f = nextFloat();\r\n}\r\n\r\n// default parsers for JS.\r\nfunction nextInt() {\r\n    return parseInt(nextString());\r\n}\r\n\r\nfunction nextFloat() {\r\n    return parseFloat(nextString());\r\n}\r\n\r\nfunction nextString() {\r\n    var next_string = \"\";\r\n    clearWhitespaces();\r\n    while (input_cursor < input_stdin.length && !isWhitespace(input_stdin[input_cursor])) {\r\n        next_string += input_stdin[input_cursor];\r\n        input_cursor += 1;\r\n    }\r\n    return next_string;\r\n}\r\n\r\nfunction nextChar() {\r\n    clearWhitespaces();\r\n    if (input_cursor < input_stdin.length) {\r\n        return input_stdin[input_cursor++];\r\n    } else {\r\n        return '\\0';\r\n    }\r\n}\r\n\r\nprocess.stdin.resume();\r\nprocess.stdin.setEncoding('ascii');\r\n\r\nvar input_stdin = \"\";\r\nvar input_cursor = 0;\r\nprocess.stdin.on('data', function (data) { input_stdin += data; });\r\nprocess.stdin.on('end', function () { main(); });\r\n\r\nfunction isWhitespace(character) {\r\n    return ' \\t\\n\\r\\v'.indexOf(character) > -1;\r\n}\r\n\r\nfunction clearWhitespaces() {\r\n    while (input_cursor < input_stdin.length && isWhitespace(input_stdin[input_cursor])) {\r\n        // ignore the next whitespace character\r\n        input_cursor += 1;\r\n    }  \r\n}",
        "timeRatio": 1.2,
        "extraTime": 80.0
    }, {
        "id": 27,
        "name": "Scala",
        "isCompiled": true,
        "extension": "scala",
        "aceMode": "scala",
        "defaultSource": "object Main extends App {\r\n    println(\"Hello, World!\")\r\n}",
        "timeRatio": 1.2,
        "extraTime": 450.0,
        "extraMemory": 22
    }, {
        "id": 28,
        "name": "Pypy 2",
        "isCompiled": true,
        "extension": "py",
        "aceMode": "python",
        "defaultSource": "num1 = input()\r\nnum2 = input()\r\nres = num1 + num2\r\nprint res",
        "timeRatio": 1.5
    }, {
        "id": 26,
        "name": "Swift",
        "isCompiled": true,
        "extension": "swift",
        "aceMode": "swift",
        "defaultSource": "import Foundation\r\n\r\n// we read standard input line by line\r\nlet a = Int(readLine()!)!\r\nlet b = Int(readLine()!)!\r\nprint(a + b)"
    }, {
        "id": 29,
        "name": "Pypy3",
        "isCompiled": true,
        "extension": "py",
        "aceMode": "python",
        "defaultSource": "num1 = input()\r\nnum2 = input()\r\nres = num1 + num2\r\nprint(res)",
        "timeRatio": 2.0
    }, {
        "id": 31,
        "name": "Rust",
        "isCompiled": true,
        "extension": "rs",
        "aceMode": "rust",
        "defaultSource": "fn main() {\r\n    let cin = std::io::stdin();\r\n    let mut s = String::new();\r\n    cin.read_line(&mut s).unwrap();\r\n    let values = s\r\n        .split_whitespace()\r\n        .map(|x| x.parse::<i32>())\r\n        .collect::<Result<Vec<i32>, _>>()\r\n        .unwrap();\r\n    assert!(values.len() == 2);\r\n    let var1 = values[0];\r\n    let var2 = values[1];\r\n    println!(\"{}\", var1 + var2);\r\n}"
    }, {
        "id": 32,
        "name": "Julia",
        "isCompiled": false,
        "extension": "jl",
        "aceMode": "julia",
        "defaultSource": "using DelimitedFiles\r\na, b = readdlm(IOBuffer(readline()))\r\nprintln(Int(a + b))",
        "extraTime": 250.0,
        "extraMemory": 131072
    }, {
        "id": 30,
        "name": "Kotlin",
        "isCompiled": true,
        "extension": "kt",
        "aceMode": "kotlin",
        "defaultSource": "fun main(args: Array<String>) {\r\n    println(\"Hello CS Academy!\")\r\n}",
        "timeRatio": 1.2,
        "extraTime": 80.0,
        "extraMemory": 8192
    }, {
        "id": 25,
        "name": "Go",
        "isCompiled": true,
        "extension": "go",
        "aceMode": "golang",
        "defaultSource": "package main\r\n\r\nimport \"fmt\"\r\n\r\nfunc main() {\r\n    var a, b int\r\n    fmt.Scanln(&a, &b)\r\n    fmt.Print(a + b)\r\n}"
    }],
    "TermDefinition": [{
        "id": 1,
        "term": "graph",
        "title": "Graph",
        "definition": "A *graph* is a way to represent a set of objects and relationships between them. The objects are called *nodes* or *vertices* and the relations between them *edges*."
    }, {
        "id": 13,
        "term": "connected graph",
        "title": "Connected graph",
        "definition": "A <Definition value=\" graph \" /> is *connected* if any node is reachable from any other node by traversing some edges."
    }, {
        "id": 14,
        "term": "connected component",
        "title": "Connected component",
        "definition": "In a <Definition value=\" graph \" /> a *connected component* is a maximal subset of nodes with the property that the graph formed only by those nodes and their incident edges is <Definition term=\" connected graph \" value=\" connected \" />."
    }, {
        "id": 15,
        "term": "weakly connected graph",
        "title": "Weakly connected graph",
        "definition": "A <Definition value=\" directed graph \"/> is *weakly connected* if ignoring the orientation of the edges produces a <Definition value=\" connected graph \"/>."
    }, {
        "id": 16,
        "term": "strongly connected graph",
        "title": "Strongly connected graph",
        "definition": "A <Definition value=\" directed graph \" /> is *strongly connected* if there is a <Definition value=\" path \" /> between every ordered pair of nodes."
    }, {
        "id": 17,
        "term": "strongly connected component",
        "title": "Strongly connected component",
        "definition": "A maximal <Definition value=\" subgraph \" /> which is <Definition term=\" strongly connected graph \" value=\" strongly connected \" /> represents a *strongly connected component*."
    }, {
        "id": 2,
        "term": "recursion",
        "title": "Recursion",
        "definition": "The *repeated* application of a <Definition term=\"recursion\" value=\" recursive \" /> function."
    }, {
        "id": 4,
        "term": "subgraph",
        "title": "Subgraph",
        "definition": "A subset of a <Definition value=\" graph \" />'s nodes and the edges between them represent a *subgraph*."
    }, {
        "id": 20,
        "term": "maximum independent set",
        "title": "Maximum Independent Set",
        "definition": "The *maximum independent set* of a  <Definition term=\"graph\" /> is a maximum subset of nodes such that there isn't any edge connecting two nodes from the subset."
    }, {
        "id": 6,
        "term": "transpose graph",
        "title": "Transpose graph",
        "definition": "The *transpose* of a <Definition value=\" directed graph \" /> is a graph where an <Definition value=\" arc \" /> `(u, v)` exists iff the arc `(v, u)` exists in the original graph."
    }, {
        "id": 7,
        "term": "arc",
        "title": "Arc",
        "definition": "The <Definition value=\" edges \" term=\" graph \" /> of a <Definition value=\" directed graph \" /> are called *arcs*."
    }, {
        "id": 8,
        "term": "degree",
        "title": "Degree",
        "definition": "The *degree* of a node in a <Definition value=\" graph \" /> represents the number of edges connected to that node."
    }, {
        "id": 9,
        "term": "indegree",
        "title": "Indegree",
        "definition": "The *indegree* of a node in a <Definition value=\" directed graph \" /> represents the number of <Definition value=\" arcs \" term=\" arc \" /> coming into that node."
    }, {
        "id": 10,
        "term": "outdegree",
        "title": "Outdegree",
        "definition": "The *outdegree* of a node in a <Definition value=\" directed graph \" /> represents the number of <Definition value=\" arcs \" term=\" arc \" /> going out of that node."
    }, {
        "id": 11,
        "term": "path",
        "title": "Path",
        "definition": "A *path* is a sequence of <Definition value=\" nodes \" term=\" graph \"/> with the property that every two consecutive nodes are adjacent to each other."
    }, {
        "id": 12,
        "term": "cycle",
        "title": "Cycle",
        "definition": "A *cycle* is a sequence of <Definition value=\" nodes \" term=\" graph \"/> with the property that the first and the last node are identical and every two consecutive nodes are adjacent to each other. In the case of a <Definition value=\" directed graph \"/> all the <Definition term=\" arc \" value=\" arcs \" /> should have the same orientation."
    }, {
        "id": 21,
        "term": "subarray",
        "title": "Subarray",
        "definition": "A *subarray* is a subset of /consecutive/ elements of an array."
    }, {
        "id": 19,
        "term": "condensation graph",
        "title": "Condensation graph",
        "definition": "The *condensation* of a <Definition value=\" directed graph \" /> is the result of building a new graph where each node is associated with a <Definition value=\" strongly connected component \"> from the original graph."
    }, {
        "id": 5,
        "term": "directed graph",
        "title": "Directed graph",
        "definition": "A *directed graph* is a <Definition value=\" graph \" /> where all the edges have a direction associated with them."
    }, {
        "id": 22,
        "term": "clique",
        "title": "Clique",
        "definition": "A *clique* is a subset of vertices of an undirected <Definition value=\"graph\" /> such that its induced subgraph is complete."
    }, {
        "id": 23,
        "term": "monotonic increasing",
        "title": "Monotonic Increasing",
        "definition": "A function is *monotonic increasing* if it's always increasing or remaining constant, and never decreasing."
    }, {
        "id": 24,
        "term": "complement graph",
        "title": "Complement Graph",
        "definition": "The *complement* or *inverse* of a graph $G$ is a graph $H$ on the same vertices such that two distinct vertices of $H$ are adjacent if and only if they are not adjacent in $G$."
    }, {
        "id": 25,
        "term": "graph union",
        "title": "Graph Union",
        "definition": "Given to graphs $G1$ and $G2$, their graph union is determined by $G1 \u222a G2 = (V1 \u222a V2, E1 \u222a E2)$. When $V1$ and $V2$ are disjoint, the graph union is referred to as the disjoint graph union, and denoted $G1 + G2$."
    }, {
        "id": 26,
        "term": "rooted tree",
        "title": "Rooted Tree",
        "definition": "A *rooted tree* is a <Definition term=\"tree\" value=\"tree\" /> in which a special node is singled out. This node is called the *root* of the tree."
    }, {
        "id": 27,
        "term": "ordered rooted tree",
        "title": "Ordered Rooted Tree",
        "definition": "An *ordered rooted tree* is a <Definition term=\"rooted tree\"/> that has the subtrees of every node in a particular order."
    }, {
        "id": 3,
        "term": "tree",
        "title": "Tree",
        "definition": "A *tree* is a connected <Definition value=\" graph \" /> that doesn't contain any cycles. A tree with $N$ nodes has $N-1$ edges."
    }, {
        "id": 28,
        "term": "subsequence",
        "title": "Subsequence",
        "definition": "A *subsequence* is a sequence that can be derived from another sequence by deleting some elements without changing the order of the remaining elements."
    }, {
        "id": 18,
        "term": "directed acyclic graph",
        "title": "Directed acyclic graph (DAG)",
        "definition": "A *directed acyclic graph*, or a *DAG*, is a <Definition term=\"directed graph\" /> that doesn't contain any <Definition term=\"cycle\" value=\"cycles\" />."
    }, {
        "id": 31,
        "term": "full binary tree",
        "title": "Full binary tree",
        "definition": "A *full binary tree* is a <Definition term=\"binary tree\"/> in which every level is completely filled."
    }, {
        "id": 30,
        "term": "binary tree",
        "title": "Binary Tree",
        "definition": "A *binary tree* is a <Definition term=\"rooted tree\"/> in which every node has at most two direct sons."
    }, {
        "id": 29,
        "term": "complete binary tree",
        "title": "Complete Binary Tree",
        "definition": "A *complete binary tree* is a <Definition term=\"binary tree\"/> in which every level, except possibly the last, is completely filled, and all nodes are as far left as possible."
    }, {
        "id": 32,
        "term": "substring",
        "title": "Substring",
        "definition": "A *substring* is a subset of /consecutive/ characters of a string."
    }, {
        "id": 34,
        "term": "perfect cube",
        "title": "Perfect Cube",
        "definition": "A *perfect cube* is a number which is equal to an integer raised to the power of <Latex value=\"3\"/>."
    }, {
        "id": 33,
        "term": "correctly parenthesised",
        "title": "Correctly Parenthesised",
        "definition": "A string consisting of parentheses is correctly parenthesised if:\r\n- The number of /left parentheses/ is equal to the number of /right parentheses/.\r\n- Every prefix of the string contains at least as many left parentheses as right parentheses.\r\nFor example the strings <Latex value=\"()(())\"/> and <Latex value=\"(()())\"/> are correctly parenthesised, while <Latex value=\"())(\"/> and <Latex value=\"(()(\"/> are not."
    }, {
        "id": 35,
        "term": "prime factorization",
        "title": "Prime Factorization",
        "definition": "*Prime factorization* or *integer factorization* of a number is the determination of the set of prime numbers which multiply together to give the original integer. It is also known as *prime decomposition*."
    }, {
        "id": 36,
        "term": "perfect square",
        "title": "Perfect Square",
        "definition": "A *perfect square* is an integer that is the square of an integer; in other words, it is the product of some integer with itself."
    }, {
        "id": 37,
        "term": "bst",
        "title": "Binary Search Tree",
        "definition": "A *binary search tree* is a data structure used store keys. It is implemented as a binary <Definition term=\"rooted tree\"/> where each node has an associated key. For every node its key is greater than the keys in the node's left subtree and smaller than the keys in the node's right subtree."
    }, {
        "id": 38,
        "term": "preorder",
        "title": "Preorder Traversal",
        "definition": "The *preorder traversal* of a <Definition term=\"bst\" value=\"binary search tree\"/> is a way of displaying its keys starting with the <Definition term=\"rooted tree\" value=\"root\"/>, then <Definition term=\"recursion\" value=\"recursively\"/> showing the keys in the left subtree and then those in the right subtree."
    }, {
        "id": 39,
        "term": "tree diameter",
        "title": "Tree Diameter",
        "definition": "The *diameter* of a tree is the length of the longest path between two nodes."
    }, {
        "id": 40,
        "term": "adaptive task",
        "title": "Adaptive Task",
        "definition": "An interactive problem is *adaptive* if the interactor's answers may differ according to the contestant's queries."
    }, {
        "id": 41,
        "term": "interactive task",
        "title": "Interactive Task",
        "definition": "A task is *interactive* if you are required to write a program that interacts with another program written by the problem setter(s). You will ask queries and get answers online. The communication between the two programs is done using standard input/output. Whenever you print something you should call a function that flushes the output stream. You can find more details about interactive problems in this <Link href=\"/blog/#introducing-interactive-problems\" value=\"blog post\"/>."
    }, {
        "id": 42,
        "term": "isomorphic",
        "title": "Isomorphic Graphs",
        "definition": "Two graphs are *isomorphic* if we can apply a permutation on the labels of the first graph in order to get the second graph."
    }, {
        "id": 43,
        "term": "fibonacci",
        "title": "Fibonacci Numbers",
        "definition": "*Fibonacci* numbers are the numbers in the following sequence, characterized by the fact that every number after the first two is the sum of the two preceding ones:\r\n<Latex value=\"1\\ 1\\ 2\\ 3\\ 5\\ 8\\ 13...\"/>"
    }, {
        "id": 44,
        "term": "enforced template",
        "title": "Enforced Template",
        "definition": "A task using an *enforced template* usually asks you to implement one or more functions, methods or classes. Some parts of the code are written by the problem setter(s) and they are not editable. You can find more details about enforced template problems in this <Link href=\"/blog/#introducing-enforced-templates\" value=\"blog post\"/>."
    }, {
        "id": 45,
        "term": "data type",
        "title": "Data Type",
        "definition": "A *data type* is a classification of data which tells the compiler or interpreter how the programmer intends to use the data."
    }, {
        "id": 46,
        "term": "abstract data type",
        "title": "Abstract Data Type",
        "definition": "An *abstract data type* is a mathematical model for <Definition term=\"data type\" value=\"data types\"/> where a data type is defined by its behavior (semantics) from the point of view of a user of the data. It contrasts with <Definition term=\"data structure\" value=\"data structures\"/>, which are concrete representations of data, and are the point of view of an implementer, not a user."
    }, {
        "id": 47,
        "term": "data structure",
        "title": "Data Structure",
        "definition": "A *data structure* is a particular way of organizing data in a computer so that it can be used efficiently."
    }, {
        "id": 48,
        "term": "minimum vertex cover",
        "title": "Minimum Vertex Cover",
        "definition": "A *minimum vertex cover* or *minimum node cover* is a subset of nodes of minimum size such that each edge of the graph is incident to at least one node of the subset."
    }, {
        "id": 49,
        "term": "tournament",
        "title": "Tournament",
        "definition": "A *tournament* is a <Definition term=\"directed graph\"/> obtained by assigning a direction for each edge in an undirected <Definition term=\"complete graph\"/>."
    }, {
        "id": 50,
        "term": "complete graph",
        "title": "Complete Graph",
        "definition": "A *complete graph* is a simple undirected <Definition term=\"graph\"/> in which every pair of distinct vertices is connected by a unique edge."
    }, {
        "id": 51,
        "term": "manhattan distance",
        "title": "Manhattan Distance",
        "definition": "The *Manhattan Distance* between two points $$P$$ and $$Q$$ is equal to $$|P_x-Q_x| + |P_y-Q_y|$$."
    }, {
        "id": 52,
        "term": "bounding box",
        "title": "Bounding Box",
        "definition": "The *bounding box* of a set of points is the minimum area rectangle with sides parallel to the coordinate axes that contains all the points."
    }, {
        "id": 53,
        "term": "throttle",
        "title": "Throttle",
        "definition": "Restrict the number of times a certain action can be done in a period of time (example: at most 10 password reset request in any given 24 hour period)"
    }, {
        "id": 54,
        "term": "web app",
        "title": "Web App",
        "definition": "Something that's designed like an application, running in your browser: single-page (never having to refresh once you're on it), and a lot more dynamic than a plain HTML web page."
    }, {
        "id": 55,
        "term": "development road-map",
        "title": "Development Road Map",
        "definition": "A plan that matches short-term and long-term goals with specific technology solutions to help meet those goals."
    }, {
        "id": 56,
        "term": "downtime",
        "title": "Down time",
        "definition": "A (short) period of time in which a web site or web app is unreachable. One of the most important things to avoid."
    }, {
        "id": 57,
        "term": "UI",
        "title": "User Interface",
        "definition": "The collection of objects that the user can see in a website."
    }, {
        "id": 58,
        "term": "query",
        "title": "Database Query",
        "definition": "A singular operation that requests to view/modify data in a database. Often used as a unit of measurement for many efficiency tests."
    }, {
        "id": 59,
        "term": "palindrome",
        "title": "Palindrome",
        "definition": "A string is a palindrome if we can obtain the same string by reversing it.\r\n\r\nFor example, `abcba`, `abba`, a are *palindromes*, and `abc` is not a palindrome."
    }],
    "ContestScoring": [{
        "id": 2,
        "name": "ACM",
        "description": "No dynamic scores, with classic ACM penalty",
        "config": {},
        "hasPenalty": true,
        "hasDynamicPoints": false,
        "hasPartialScoring": false
    }, {
        "id": 3,
        "name": "CSA Rounds",
        "description": "This is the default for CSA Rounds.\nClassic dynamic scores and penalty.\n(last submission + log2(resubmissions))",
        "config": {},
        "hasPenalty": true,
        "hasDynamicPoints": true,
        "hasPartialScoring": false
    }, {
        "id": 1,
        "name": "Partial Scoring",
        "description": "No penalty or dynamic scores.\r\nSubmissions that do not pass examples are taken into consideration.\r\nUsed for consistency.",
        "config": {},
        "hasPenalty": false,
        "hasDynamicPoints": false,
        "hasPartialScoring": true
    }, {
        "id": 5,
        "name": "Partial Scoring with time penalty",
        "description": "Submissions that do not pass examples are taken into consideration.\r\nThe same as partial scoring, but if 2 users have the same score, the tiebreaker will be the penalty. The penalty is computed as the smallest time when a user achieved the highest number of points. Eg: if you submit 2 solutions, one worth 50 and the other 25, the time will be of the first one. If after you submit another solution for another task, worth 50 points, the final penalty will be the time of the 3rd submission and the total score will be 100.",
        "config": {},
        "hasPenalty": true,
        "hasDynamicPoints": false,
        "hasPartialScoring": true
    }, {
        "id": 6,
        "name": "ACM Scoring with CSA Penalty",
        "description": "Same as CSA scoring but without dynamic points",
        "config": {},
        "hasPenalty": true,
        "hasDynamicPoints": false,
        "hasPartialScoring": false
    }, {
        "id": 4,
        "name": "IEEEXTreme11",
        "description": "Scoring specif for IEEE contest.",
        "config": {},
        "hasPenalty": true,
        "hasDynamicPoints": true,
        "hasPartialScoring": true
    }]
};