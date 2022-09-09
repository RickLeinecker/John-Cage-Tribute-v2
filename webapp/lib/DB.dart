import 'package:drift/drift.dart';
import 'package:drift/web.dart';
import 'package:path/path.dart' as p;

import 'dart:io';

part 'DB.g.dart';

class Users extends Table {
  IntColumn get userId => integer().autoIncrement()();
  TextColumn get userName => text().withLength(max:32).unique()();
  TextColumn get password => text().withLength(min: 8, max:32)();
  IntColumn get email => integer().unique()();
  BoolColumn get accountType => boolean().clientDefault(() => false)();

}

class UserRecordings extends Table {
  IntColumn get userId => integer().references(Users, #userId)();
  IntColumn get recordingId => integer().references(Recordings, #recordingId)();
}

class Recordings extends Table {
  IntColumn get recordingId => integer().autoIncrement()();
  IntColumn get maestroId => integer().references(Users, #userId)();
  TextColumn get title => text().withLength(max:255).unique()();
  IntColumn get lengthSeconds => integer()();
  TextColumn get audioFile => text().withLength(max:255)();
  IntColumn get recordingDate => integer()();
  IntColumn get inContest => integer()();

}

class Contests extends Table {
  IntColumn get contestId => integer()();
  IntColumn get recordingIdFirst=> integer().references(Recordings, #recordingId)();
  IntColumn get recordingIdSecond => integer().references(Recordings, #recordingId)();
  IntColumn get recordingIdThird => integer().references(Recordings, #recordingId)();
}

@DriftDatabase(tables: [Users, UserRecordings, Recordings, Contests])
class MyDatabase extends _$MyDatabase {
  MyDatabase() : super(WebDatabase('db.sqlite'));

  @override
  int get schemaVersion => 1;

  @override
  MigrationStrategy get migration {
    return MigrationStrategy(onCreate: (Migrator m) async {
      await m.createAll();
    });
  }
}

LazyDatabase _openConnection() {
  return LazyDatabase(() async {
    final dbFolder = '../../db';
    final file = File(p.join(dbFolder, 'db.sqlite'));
    return WebDatabase('db.sqlite');
  });
}
