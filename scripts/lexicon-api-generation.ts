import path from "path";
import fs from "fs";

const runAfterLexiconApiGeneration = () => {
  const lexiconApiPath = path.join(__dirname, "..", "lexicon-api");

  // Add the following lines to the top of the lexicon-api/index.ts file
  // import {
  //     ComAtprotoRepoListRecords,
  //     ComAtprotoRepoGetRecord,
  //     ComAtprotoRepoCreateRecord,
  //     ComAtprotoRepoPutRecord,
  //     ComAtprotoRepoDeleteRecord,
  //   } from "@atproto/api";

  const lines = [
    "import {",
    "    ComAtprotoRepoListRecords,",
    "    ComAtprotoRepoGetRecord,",
    "    ComAtprotoRepoCreateRecord,",
    "    ComAtprotoRepoPutRecord,",
    "    ComAtprotoRepoDeleteRecord,",
    '  } from "@atproto/api";',
  ];

  const indexTsPath = path.join(lexiconApiPath, "index.ts");
  const indexTsContent = fs.readFileSync(indexTsPath, "utf8");

  // Only add the import if it isn't already present
  const importStatement = lines.join("\n").trim();
  let updatedIndexTsContent = indexTsContent;
  if (!indexTsContent.includes('from "@atproto/api"')) {
    updatedIndexTsContent = [importStatement, indexTsContent].join("\n");
    fs.writeFileSync(indexTsPath, updatedIndexTsContent, "utf8");
    console.log("index.ts updated successfully");
  } else {
    console.log("index.ts already contains the required import");
  }

  // Fix imports/exports in lexicon-api/lexicons.ts and index.ts
  // Remove .ts and .js extensions from import/export statements

  const filesToFix = ["lexicons.ts", "index.ts"];

  for (const fileName of filesToFix) {
    const filePath = path.join(lexiconApiPath, fileName);
    const fileContent = fs.readFileSync(filePath, "utf8");

    // Regex to match import/export statements with .ts or .js extensions
    // Matches: from "...something.ts" or from "...something.js"
    // Also handles: from '...something.ts' or from '...something.js'
    const importExportRegex = /(from\s+["'])([^"']+)(\.(ts|js))(["'])/g;

    let updatedContent = fileContent;
    let changed = false;

    // Replace all matches
    updatedContent = updatedContent.replace(
      importExportRegex,
      (match, prefix, pathWithoutExt, ext, extType, suffix) => {
        changed = true;
        return prefix + pathWithoutExt + suffix;
      }
    );

    if (changed) {
      fs.writeFileSync(filePath, updatedContent, "utf8");
      console.log(
        `${fileName} updated successfully (removed .ts/.js extensions)`
      );
    } else {
      console.log(`No .ts/.js extensions found in ${fileName}`);
    }
  }

  console.log(
    "\n If you see errors in the api files, please restart TS server."
  );
};

runAfterLexiconApiGeneration();
