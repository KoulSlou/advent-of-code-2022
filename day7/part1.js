const fs = require("fs");
const { default: nodeTest } = require("node:test");

const file_data = fs.readFileSync("./input.txt", "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
});

const lines = file_data.split(/\r?\n/);
const max_threshold = 100000;

let root_dir = null;
let current_dir = null;

for (line of lines) {
  if (line.indexOf("$") === -1) {
    //this is a list of files and dir
    let parts = line.split(" ");
    if (parts[0] === "dir") {
      //this is a dir
      current_dir.nested_dirs.push(parts[1]);
    } else {
      //this is a file
      current_dir.direct_files.push({ name: parts[1], size: +parts[0] });
      current_dir.direct_files_size += +parts[0];
    }
  } else {
    //this is a command
    let directory_change = line.match(/\$ cd (.*)/);
    if (directory_change) {
      let directory_name = directory_change[1];
      //special case
      if (directory_name === "..") {
        current_dir = current_dir.parent_dir;
      } else {
        //make listed dir a current dir

        let dir = {
          name: directory_name,
          nested_dirs: [],
          nested_dirs_links: [],
          direct_files: [],
          direct_files_size: 0,
          parent_dir: current_dir,
        };

        if (dir.parent_dir) dir.parent_dir.nested_dirs_links.push(dir);

        if (directory_name === "/") {
          root_dir = dir;
        }

        current_dir = dir;
      }
    }
  }
}

//go through filesystem and calculate total_size
function getNodeTotalSize(node) {
  if (node.nested_dirs_links.length === 0) {
    node.total_size = node.direct_files_size;
    return node.direct_files_size;
  } else {
    let total_size = node.direct_files_size;
    for (nested_link of node.nested_dirs_links) {
      total_size += getNodeTotalSize(nested_link);
    }
    node.total_size = total_size;
    return total_size;
  }
}

let sum = 0;

function filterTooLargeDirectories(node) {
  if (node.total_size <= max_threshold) {
    sum += node.total_size;
  }
  //go through all nested directories
  for (nested_link of node.nested_dirs_links) {
    filterTooLargeDirectories(nested_link);
  }
}

getNodeTotalSize(root_dir);
filterTooLargeDirectories(root_dir);
console.log(sum);
