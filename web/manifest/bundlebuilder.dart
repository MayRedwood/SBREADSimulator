import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'dart:typed_data';

import "package:archive/archive.dart";

String relPath = "web/";
RegExp slash = new RegExp("[\\/]");

void main() {
    process();
}

Future<bool> process() async {
    print("Reading source manifest");
    Map<String, Set<String>> sourceManifest = readManifest(await readSource());

    Map<String, Set<String>> manifest = <String, Set<String>>{};

    for (String bundle in sourceManifest.keys) {
        Set<String> files = sourceManifest[bundle];

        int split = bundle.lastIndexOf(slash)+1;
        String dir = bundle.substring(0, split);

        String remdir = "$relPath$dir";

        for (String pattern in files) {
            RegExp p = new RegExp(pattern);

            Directory directory = new Directory(remdir);
            List<FileSystemEntity> entries = directory.listSync(recursive:true);

            List<FileSystemEntity> matching = entries.where((FileSystemEntity f) {
                return (f is File) && p.hasMatch(f.path.split(slash).last);
            }).toList();

            if (!manifest.containsKey(bundle)) {
                manifest[bundle] = new Set<String>();
            }

            for (FileSystemEntity f in matching) {
                String name = f.path.substring(remdir.length);

                manifest[bundle].add(name);
            }
        }
    }

    List<String> output = writeManifest(manifest);
    writeManifestFile(output);

    for (String bundle in manifest.keys) {
        writeBundle(bundle, manifest[bundle]);
    }

    return true;
}

Future<List<String>> readSource() async {
    Completer<List<String>> callback = new Completer<List<String>>();
    final File smfile = new File("${relPath}manifest/sourcemanifest.txt");

    List<String> sourcelines = <String>[];
    smfile.openRead()
        .transform(UTF8.decoder)
        .transform(new LineSplitter())
        .listen(sourcelines.add, onDone: () => callback.complete(sourcelines));

    return callback.future;
}

void writeManifestFile(List<String> lines) {
    print("Writing manifest file");
    final File manifest = new File("${relPath}manifest/manifest.txt");

    IOSink writer = manifest.openWrite();

    for (String line in lines) {
        writer.writeln(line);
    }

    writer.close();
}

Map<String,Set<String>> readManifest(List<String> lines) {
    Map<String, Set<String>> data = <String, Set<String>>{};

    String bundle = null;

    for (int i=1; i<lines.length; i++) {
        String line = lines[i];

        if (line.isEmpty) {
            // empty line, not in a block
            bundle = null;
        } else {
            if (bundle == null) {
                // first non-empty, set bundle
                bundle = line.trim();
            } else {
                // subsequent non-empty, add to category
                if (!data.containsKey(bundle)) {
                    data[bundle] = new Set<String>();
                }

                data[bundle].add(line.trim());
            }
        }
    }

    return data;
}

List<String> writeManifest(Map<String,Set<String>> data) {
    List<String> lines = <String>[];

    lines..add("SBURBSim Bundle Manifest")..add("");

    for (String bundle in data.keys) {
        lines.add(bundle);
        for (String file in data[bundle]) {
            lines.add("    $file");
        }
        lines.add("");
    }

    return lines;
}

Future<bool> writeBundle(String path, Iterable<String> files) async {
    print("Creating bundle $path with ${files.length} files");
    ZipEncoder encoder = new ZipEncoder();

    String dirpath = "$relPath${path.substring(0,path.lastIndexOf(slash)+1)}";
    String fullpath = "$relPath$path.bundle";

    Archive archive = new Archive();

    for (String file in files) {
        File f = new File("$dirpath$file");
        int len = f.lengthSync();
        archive.addFile(new ArchiveFile(file, len, await f.readAsBytes()));
    }

    Uint8List compressed = encoder.encode(archive);
    File out = new File(fullpath);
    out.writeAsBytes(compressed, flush: true);

    return true;
}