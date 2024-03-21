import {UI} from "../../stemjs/src/ui/UIBase.js";
import {Link} from "../../stemjs/src/ui/primitives/Link.jsx";

class ProblemSetting extends UI.Element {
    extraNodeAttributes(attr) {
        attr.setStyle("width", "60%");
        attr.setStyle("margin-left", "20%");
    }

    render() {
        return [
            <h1 style="margin-bottom: 20px;">Problem setting</h1>,
            <p>
                We are looking for hard problems. Each Div. 1 + Div. 2 round consists of <strong>7</strong> tasks of varying difficulty.
                The first few are addressed to the casual competitors, while the last three are supposed to be more
                challenging. These last three problems (let's label them <strong>1, 2, 3</strong>, with <strong>1</strong> being the hardest)
                are what we are looking for.
            </p>,
            <p>
                You can check out previous Rounds
                <Link value="#4"  href="/contest/beta-round-4/" />,
                <Link value="#9"  href="/contest/round-9/" /> and
                <Link value="#18" href="/contest/round-18/" />
                to get an idea about the kind of tasks we consider suitable for future contests.
            </p>,

            <p>As the bottleneck of setting a contest usually consists of finding a suitable <strong>1</strong>
                (the hardest problem), we will accept the following proposals:
            </p>,
            <ul>
                <li><strong>1</strong>: 200$</li>
                <li><strong>1 + 2</strong>: 200$ + 125$ = 325$</li>
                <li><strong>1 + 2 + 3</strong>: 200$ + 125$ + 75$ = 400$</li>
            </ul>,

            <p>The first step of becoming a problem setter consists in sending us an email at
            <a href="mailto:contact@csacademy.com">contact@csacademy.com</a> consisting of:</p>,
            <ul>
                <li> Short problem statement. Leave out any unnecessary story details, as we will write the final draft. Our policy is to create minimalistic statements. </li>
                <li> Solution description (.txt, .pdf, .doc, .docx, etc.) </li>
            </ul>,

            <p>If we accept your proposal you will be required to further provide:</p>,
            <ul>
                <li> Official solution in C++ and/or Java. </li>
                <li> Tests. </li>
                <li> Checker (if it's the case). </li>
                <li> (Optional): Brute force, wrong greedy, or any other solution that shouldn't pass the test cases. </li>
            </ul>,

            <p>
                For any other questions contact us at <a href="mailto:contact@csacademy.com">contact@csacademy.com</a>.
            </p>
        ];
    }
}

export {ProblemSetting};