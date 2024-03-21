import {
    Store,
    StoreObject
} from "../../../stemjs/src/state/Store.js";
import {
    UserStore
} from "../../../csaaccounts/js/state/UserStore.js";

const extraLanguageAttributes = [
    [1, {
        enforcedTemplateComment: '/* \n * ATTENTION!\n * This task does not have an enforced\n * template in this language!\n *\n * However, you can still submit any custom code.\n */\n\n',
        compiler: "g++ 13.2.0",
        comment: "Compiled with `g++ -static -O2 -lm -Wall -Wno-unused-result -std=c++2b -DCS_ACADEMY -DONLINE_JUDGE`.\nBoost 1.74.0 is available.",
        alternativeExtensions: ["h", "hpp"]
    }],
    // Plain C
    [13, {
        enforcedTemplateComment: '/* \n * ATTENTION!\n * This task does not have an enforced\n * template in this language!\n *\n * However, you can still submit any custom code.\n */\n\n',
        compiler: "gcc 13.2.0",
        comment: "Compiled with `gcc -O2 -lm -Wall -Wno-unused-result -DCS_ACADEMY -DONLINE_JUDGE`"
    }],
    [2, {
        enforcedTemplateComment: '/* \n * ATTENTION!\n * This task does not have an enforced\n * template in this language!\n *\n * However, you can still submit any custom code.\n */\n\n',
        compiler: "OpenJDK Java 21",
        comment: "Run with `java -Xmx4g -Xss256m -DONLINE_JUDGE -DCS_ACADEMY Main`"
    }],
    [4, {
        enforcedTemplateComment: '"""\n ATTENTION!\n This task does not have an enforced\n template in this language!\n \n However, you can still submit any custom code.\n"""\n\n',
        comment: "Comes with `numpy` and `scipy` modules",
        compiler: "Python 3.11.5"
    }],
    // Pypy3
    [29, {
        compiler: "Python 3.9.17, PyPy 7.3.12"
    }],
    [3, {
        enforcedTemplateComment: '"""\n ATTENTION!\n This task does not have an enforced\n template in this language!\n \n However, you can still submit any custom code.\n"""\n\n',
        compiler: "Python 2.7.18"
    }],
    [10, {
        enforcedTemplateComment: '# ATTENTION!\n# This task does not have an enforced\n# template in this language!\n# \n# However, you can still submit any custom code.\n\n',
        compiler: "Ruby 3.1.2p20"
    }],
    [11, {
        enforcedTemplateComment: '# ATTENTION!\n# This task does not have an enforced\n# template in this language!\n# \n# However, you can still submit any custom code.\n\n',
        compiler: "Perl 5.36.0"
    }],
    [5, {
        enforcedTemplateComment: '/* \n * ATTENTION!\n * This task does not have an enforced\n * template in this language!\n *\n * However, you can still submit any custom code.\n */\n\n',
        compiler: "Mono 6.8.0.105",
        comment: "Compiled with `mcs -define:ONLINE_JUDGE -define:CS_ACADEMY`",
    }],
    [14, {
        enforcedTemplateComment: '/*\n * ATTENTION!\n * This task does not have an enforced\n * template in this language!\n *\n * However, you can still submit any custom code.\n */\n\n',
        compiler: "gcc 13.2.0",
        comment: "Compiled with `gcc -DCS_ACADEMY -DONLINE_JUDGE -I 'gnustep-config --variable=GNUSTEP_SYSTEM_HEADERS' -L 'gnustep-config --variable=GNUSTEP_SYSTEM_LIBRARIES' -lgnustep-base -fconstant-string-class=NSConstantString -D_NATIVE_OBJC_EXCEPTIONS -Wl,--no-as-needed -lgnustep-base -lobjc`"
    }],
    [26, {
        enforcedTemplateComment: '#{\n ATTENTION!\n This task does not have an enforced\n template in this language!\n \n However, you can still submit any custom code.\n#}\n\n',
        compiler: "Swift 5.0.2"
    }],
    [25, {
        enforcedTemplateComment: '#{\n ATTENTION!\n This task does not have an enforced\n template in this language!\n \n However, you can still submit any custom code.\n#}\n\n',
        compiler: "Go 1.19.2"
    }],
    [17, {
        enforcedTemplateComment: '/* \n * ATTENTION!\n * This task does not have an enforced\n * template in this language!\n *\n * However, you can still submit any custom code.\n */\n\n',
        compiler: "Node 20.5.1"
    }],
    [31, {
        compiler: "rustc 1.71.1",
    }],
    [30, {
        compiler: "kotlinc-jvm 1.4.10 (JRE 21+35-Ubuntu-1)"
    }],
    [32, {
        compiler: "julia 1.5.3",
    }],
    [8, {
        enforcedTemplateComment: '! ATTENTION!\n! This task does not have an enforced\n! template in this language!\n! \n! However, you can still submit any custom code.\n\n',
        compiler: "GNU Fortran 13.2.0",
        comment: "Compiled with `gfortran -ffree-form`"
    }],
    [9, {
        enforcedTemplateComment: '--[=====[\n ATTENTION!\n This task does not have an enforced\n template in this language!\n \n However, you can still submit any custom code.\n--]=====]\n\n',
        compiler: "Lua 5.2.4"
    }],
    [12, {
        enforcedTemplateComment: '/*\n * ATTENTION!\n * This task does not have an enforced\n * template in this language!\n *\n * However, you can still submit any custom code.\n */\n\n',
        compiler: "PHP 8.0.8"
    }],
    [15, {
        enforcedTemplateComment: '"\n ATTENTION!\n This task does not have an enforced\n template in this language!\n \n However, you can still submit any custom code.\n"\n\n',
        compiler: "GNU Smalltalk 3.2.5"
    }],
    [16, {
        enforcedTemplateComment: '(*\n * ATTENTION!\n * This task does not have an enforced\n * template in this language!\n *\n * However, you can still submit any custom code.\n *)\n\n',
        compiler: "OCaml 4.11.1"
    }],
    [18, {
        enforcedTemplateComment: '*> ATTENTION!\n*> This task does not have an enforced\n*> template in this language!\n*> \n*> However, you can still submit any custom code.\n\n',
        compiler: "GnuCOBOL 4.0",
        comment: "Compiled with `cobc -free -x`",
    }],
    [19, {
        enforcedTemplateComment: '-- ATTENTION!\n-- This task does not have an enforced\n-- template in this language!\n--\n-- However, you can still submit any custom code.\n\n',
        compiler: "GNATMAKE 10.3.0"
    }],
    [21, {
        enforcedTemplateComment: ';; ATTENTION!\n;; This task does not have an enforced\n;; template in this language!\n;; \n;; However, you can still submit any custom code.\n\n',
        compiler: "SBCL 2.1.1"
    }],
    [27, {
        enforcedTemplateComment: '#{\n ATTENTION!\n This task does not have an enforced\n template in this language!\n \n However, you can still submit any custom code.\n#}\n\n',
        compiler: "Scala 2.11.12",
        comment: "Ran with `scala -J-Xmx4g -J-Xss256m -DONLINE_JUDGE -DCS_ACADEMY Main`"
    }],
    [23, {
        enforcedTemplateComment: '# ATTENTION!\n# This task does not have an enforced\n# template in this language!\n# \n# However, you can still submit any custom code.\n\n',
        compiler: "TCL Shell 8.6.6"
    }],
    [24, {
        enforcedTemplateComment: '#{\n ATTENTION!\n This task does not have an enforced\n template in this language!\n \n However, you can still submit any custom code.\n#}\n\n',
        compiler: "GNU Octave 6.2.0"
    }],

    [20, {
        enforcedTemplateComment: '{\n ATTENTION!\n This task does not have an enforced\n template in this language!\n \n However, you can still submit any custom code.\n}\n\n',
        compiler: "Free Pascal 3.2.0",
        comment: "Compiled with `fpc -O2 -Sgic -viwn -Tlinux -dONLINE_JUDGE -dCS_ACADEMY -XS`",
        disabled: true,
    }],
    [6, {
        enforcedTemplateComment: '{-\n ATTENTION!\n This task does not have an enforced\n template in this language!\n \n However, you can still submit any custom code.\n-}\n\n',
        compiler: "GHC 8.8.4",
        disabled: true
    }],
    [7, {
        enforcedTemplateComment: '# ATTENTION!\n# This task does not have an enforced\n# template in this language!\n#\n# However, you can still submit any custom code.\n\n',
        compiler: "Bash 5.2.15",
        disabled: true,
    }],
    [22, {
        enforcedTemplateComment: '% ATTENTION!\n% This task does not have an enforced\n% template in this language!\n% \n% However, you can still submit any custom code.\n\n',
        compiler: "Erlang/OTP 23 [erts-11.1.8]",
        disabled: true,
    }],
];

let index = 1;
let extraLanguageAttributesMap = {}
for (const [key, value] of extraLanguageAttributes) {
    extraLanguageAttributesMap[key] = value;
    extraLanguageAttributesMap[key].ordinal = index++;
}

class ProgrammingLanguageObject extends StoreObject {
    constructor(obj) {
        super(obj);
        Object.assign(this, extraLanguageAttributesMap[this.id] || {});
        this.ordinal = (this.ordinal || 999) * 10000 + this.id;
    }

    getDefaultSource() {
        let user = UserStore.getCurrentUser();
        if (user) {
            return user.getCustomSetting("workspace:programmingLanguage:" + this.id + ":defaultSource", this.defaultSource);
        }
        return this.defaultSource;
    };
    // This is appended to the beginning of the code for languages which
    // do not have a template in an enforced template task

    getDefaultTemplateComment() {
        return this.enforcedTemplateComment;
    }

    getExtension() {
        return this.extension;
    }

    toString() {
        return this.name;
    };
}

class ProgrammingLanguageStoreClass extends Store("ProgrammingLanguage", ProgrammingLanguageObject) {
    all() {
        if (!this.cachedAll) {
            let objects = Array.from(super.all()).filter(pl => !pl.disabled);
            objects.sort((a, b) => a.ordinal - b.ordinal);
            this.cachedAll = objects;
        }
        return this.cachedAll;
    }

    getLanguageForFileName(fileName) {
        const parts = fileName.split(".");
        if (parts.length >= 2) {
            // Trying to get the language by languageId
            const nameWithoutExtension = parts[0];
            // 4 is the length of "Main". If that ever changes...Forta Steaua
            const languageId = parseInt(nameWithoutExtension.substring(4));
            const language = ProgrammingLanguage.get(languageId);
            if (language) {
                return language;
            }
        }
        const extension = (parts.length >= 2) ? parts.pop() : parts[0];
        for (let programmingLanguage of ProgrammingLanguage.objects.values()) {
            if (programmingLanguage.extension === extension ||
                (programmingLanguage.hasOwnProperty("alternativeExtensions") && programmingLanguage.alternativeExtensions.indexOf(extension) !== -1)) {
                return programmingLanguage;
            }
        }
        console.error("Can't get a programming language for fileName: ", fileName);
        return {
            aceMode: "text"
        };
    }

    getDefaultLanguage() {
        let programmingLanguageId = 1; // C++
        const user = UserStore.getCurrentUser();
        if (user) {
            programmingLanguageId = user.getParsedCustomSetting("workspace:preferredProgrammingLanguage", programmingLanguageId);
        }
        return ProgrammingLanguage.get(programmingLanguageId);
    }
}

const ProgrammingLanguage = new ProgrammingLanguageStoreClass();

export {
    ProgrammingLanguageObject,
    ProgrammingLanguage
}