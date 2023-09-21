
import { parse } from 'npm:node-html-parser';


export function transformSvg(inputSvg: string) {
    const svgElement = parse(inputSvg);

    if (!svgElement) {
        throw new Error("Could not parse input svg");
    }
    
    // Find all animate tags with xlink:href and move the animate tag inside the element with the id
    // E.g. 
    // <defs>
    //    <animate xlink:href="#the_path" ... />
    // </defs>
    // <path id="the_path" ... />
    
    // becomes
    
    // <defs>
    // </defs>
    // <path id="the_path" ... >
    //    <animate ... />
    // </path>
    const animateTags = (svgElement.querySelectorAll("animate") as any) ?? [];
    for (const animateTag of animateTags) {
        animateTag.parentElement?.removeChild(animateTag);
        const id= animateTag.getAttribute("xlink:href")?.replace("#", "");
        if (!id) {
            console.warn("Could not find xlink:href attribute in animate tag, maybe the file is already fixed?");
            continue;
        }
        animateTag.removeAttribute("xlink:href");
        const correspondingPath = svgElement.querySelector(`#${id}`);
        if (correspondingPath) {
            correspondingPath.appendChild(animateTag);
        } else {
            console.warn(`Could not find element with id ${id}`);
        }
    }

    return svgElement.outerHTML
}

export function fixBodymovinSmil(inputFile: string, outputFile: string) {
    const inputSvg = Deno.readTextFileSync(inputFile);
    const outputSvg = transformSvg(inputSvg);
    Deno.writeTextFileSync(outputFile, outputSvg);
}


if (Deno.args.length > 0) {
    for (const inputFile of Deno.args) {
        let outputFile = inputFile.replace(".svg", "-fixed.svg");
    fixBodymovinSmil(inputFile, outputFile);
        
    }
} else {
    const exeName = Deno.mainModule.replace(/.*\//, "");
    console.error("No input file provided");
    console.log(`Usage example: ${exeName} input.svg input2.svg`)
}

// Wait for keypress to exit
// await Deno.stdin.read(new Uint8Array(1));