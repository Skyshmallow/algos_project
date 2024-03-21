import {
    ProgrammingLanguage
} from "../../../csabase/js/state/ProgrammingLanguageStore.js";
import {
    WorkspacePlugin
} from "./WorkspacePlugin.js";


export class WorkspaceCompilerParserPlugin extends WorkspacePlugin {
    static priorityIndex = 800;

    constructor(workspaceIDE) {
        super(workspaceIDE, "CompilerParser");

        let cppLanguage = ProgrammingLanguage.get(1);
        let javaLanguage = ProgrammingLanguage.get(2);
        let python2Language = ProgrammingLanguage.get(3);
        let python3Language = ProgrammingLanguage.get(4);

        //TODO: have a compiler parser class!
        cppLanguage.compilerParser = function() {
            var obj = {};

            obj.getCompilerAnnotations = function(compilerMessage) {
                var annotations = [];
                compilerMessage.split("\n").forEach(function(message) {
                    var messageElements = message.match(/Main.cpp:(\d*)\:(\d*):\s*\w* (\w+): (.*)/);
                    if (messageElements == null) {
                        return;
                    }
                    annotations.push({
                        row: parseInt(messageElements[1]) - 1,
                        column: messageElements[2],
                        type: messageElements[3],
                        text: messageElements[4]
                    });
                });
                return annotations;
            };

            return obj;
        }();

        javaLanguage.compilerParser = function() {
            var obj = {};

            obj.getCompilerAnnotations = function(compilerMessage) {
                var annotations = [];
                compilerMessage.split("\n").forEach(function(message) {
                    var messageElements = message.match(/Main.java:(\d*)\:\s*\w* (\w+): (.*)/);
                    if (messageElements == null) {
                        return;
                    }
                    annotations.push({
                        row: parseInt(messageElements[1]) - 1,
                        column: 1,
                        type: messageElements[2],
                        text: messageElements[3]
                    });
                });
                return annotations;
            };

            return obj;
        }();

        python2Language.compilerParser = function() {
            var obj = {};

            obj.getCompilerAnnotations = function(message) {
                var annotations = [];
                var messageElements = message.match(/File "Main.py", line (\d*)\n.*\n.*\n.*\: (.*)/);
                if (messageElements == null) {
                    return;
                }
                annotations.push({
                    row: parseInt(messageElements[1]) - 1,
                    column: 1,
                    type: "error",
                    text: messageElements[2]
                });
                return annotations;
            };

            return obj;
        }();

        python3Language.compilerParser = function() {
            var obj = {};

            obj.getCompilerAnnotations = function(message) {
                var annotations = [];
                var messageElements = message.match(/File "Main.py", line (\d*)\n.*\n.*\n.*\: (.*)/);
                if (messageElements == null) {
                    return;
                }
                annotations.push({
                    row: parseInt(messageElements[1]) - 1,
                    column: 1,
                    type: "error",
                    text: messageElements[2]
                });
                return annotations;
            };

            return obj;
        }();

        for (let programmingLanguage of ProgrammingLanguage.all()) {
            if (!programmingLanguage.compilerParser) {
                programmingLanguage.compilerParser = function() {
                    var obj = {};

                    obj.getCompilerAnnotations = function(message) {
                        return [];
                    };

                    return obj;
                }();
            }
        }

        this.workspaceIDE.addListener("compileStatus", (event) => {
            let programmingLanguage = this.workspaceIDE.getPlugin("FileManager").getSelectedProgrammingLanguage();
            this.workspaceIDE.codeEditor.setAnnotations(
                programmingLanguage.compilerParser.getCompilerAnnotations(event.data.compilerMessage)
            );
        });
    };
}