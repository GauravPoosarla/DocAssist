import fs from "fs";
import { pipeline } from "@xenova/transformers";

const extractor = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");

const docs = JSON.parse(fs.readFileSync("./data/confluence_docs.json", "utf-8"));

for (let doc of docs) {
  const output = await extractor(doc.summary || doc.content, { pooling: "mean", normalize: true });
  doc.embedding = Array.from(output.data);
}

fs.writeFileSync("./data/vector_store.json", JSON.stringify(docs, null, 2));
console.log("Vector store created.");
