const fs = require('fs');

function refactorFile(filePath) {
    let code = fs.readFileSync(filePath, 'utf8');
    
    // Find the header section
    const titleRegex = /(<h1 className="text-2xl font-bold text-gray-900 tracking-tight">.*?<\/h1>)/s;
    const titleMatch = code.match(titleRegex);
    if(!titleMatch) {
       console.log("Could not find title in", filePath);
       return;
    }
    const titleHeader = titleMatch[1];

    // Find the search and filter block
    // It starts with `<div className="flex items-center gap-2 w-full sm:w-auto">`
    // and ends with `</Dialog>\n                    </div>\n                </div>\n\n                {/* Active Filter Badges */}`
    
    // We can use a trick: match everything from `<div className="flex items-center gap-2 w-full sm:w-auto">` 
    // to the end of that div which is right before `{/* Active Filter Badges */}`
    
    const searchBlockRegex = /(<div className="flex items-center gap-2 w-full sm:w-auto">.*?<\/Dialog>\n                    <\/div>)/s;
    const searchMatch = code.match(searchBlockRegex);
    
    if(!searchMatch) {
        console.log("Could not find search block in", filePath);
        return;
    }
    const searchBlockRaw = searchMatch[1];
    
    // Now let's remove the old search block from the code entirely, along with its wrapper
    code = code.replace(searchBlockRaw, '');

    // The wrapper of the search block might be empty now, it usually looks like:
    // <div className={cn("flex flex-wrap items-center gap-4", devRole === 'branch-staff' ? "justify-between" : "justify-start")}>
    // or similar. Let's locate the Tabs and change the wrapper conditionally.
    
    // Clean up the description
    code = code.replace(/<p className="text-sm text-muted-foreground">.*?<\/p>\n/s, '');
    code = code.replace(/<div className="flex flex-col gap-1">\n.*?(<h1.*?)<\/div>/s, '$1');

    // Remove the old 'Create App' button if present in the header:
    const createBtnRegex = /\{devRole === 'branch-staff' && \(\s*<Link href="\/dashboard\/pre-question">\s*<Button.*?เช็คราคา\/สร้างใบสมัครใหม่\s*<\/Button>\s*<\/Link>\s*\)\}/s;
    let createBtn = '';
    const btnMatch = code.match(createBtnRegex);
    if(btnMatch) {
        createBtn = btnMatch[0];
        code = code.replace(createBtnRegex, '');
    }

    // Rewrite the header!
    // The original header wrapper was `<div className="flex flex-row items-start justify-between gap-4">`
    // We want it to be `flex flex-col sm:flex-row sm:items-center justify-between gap-4`
    
    const finalHeader = `
                {/* Page Title Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    ${titleHeader}

                    <div className="flex items-center gap-3">
                        ${searchBlockRaw.replace(/w-full sm:w-auto/g, 'w-full sm:w-auto').trim()}
                        ${createBtn ? createBtn.replace('className="active:scale-95 transition-all shadow-sm gap-2"', 'className="active:scale-95 transition-all shadow-sm gap-2 h-9"') : ''}
                    </div>
                </div>
`;
    
    // Replace the old header container with the new one
    // Old header: `<div className="flex flex-row items-start justify-between gap-4">\s*<h1.*?\s*<\/div>` (since we replaced the inner stuff already)
    const oldHeaderRegex = /<div className="flex flex-row items-start justify-between gap-4">\s*<h1.*?\s*<\/div>/s;
    code = code.replace(oldHeaderRegex, finalHeader.trim());

    // Fix the Tabs wrapper
    // Now the Tabs are sitting in:
    // <div className={cn("flex flex-wrap items-center gap-4", ...)}>
    //                     {devRole === 'branch-staff' && ( .... )}
    //                 </div>
    // Let's change the wrapper to only conditionally render if there are tabs
    // Note: since all-applications and applications have slightly different wrappers now, we can just replace:
    // `<div className={cn("flex flex-wrap items-center gap-4", devRole === 'branch-staff' ? "justify-between" : "justify-start")}>`
    // with 
    // `{devRole === 'branch-staff' && (\n<div className="flex flex-wrap items-center justify-between gap-4">`
    // and replace the ending `)}` and `</div>` properly.
    
    code = code.replace(/<div className=\{cn\("flex flex-wrap items-center gap-4", devRole === 'branch-staff' \? "justify-between" : "justify-start"\)\}>\s*\{devRole === 'branch-staff' && \(/s, "{devRole === 'branch-staff' && (\n<div className=\"flex flex-wrap items-center justify-between gap-4\">");
    
    // Also remove the `\n                </div>\n\n                {/* Active Filter Badges */}` trailing div
    code = code.replace(/(\s*)\}\)\}\s*<\/div>\n\n\s*\{\/\* Active Filter Badges \*\/\}/s, "$1})}\n</div>\n)}\n\n{/* Active Filter Badges */}");

    fs.writeFileSync(filePath, code);
    console.log("Reformatted", filePath);
}

refactorFile('src/app/dashboard/applications/page.tsx');
refactorFile('src/app/dashboard/all-applications/page.tsx');
