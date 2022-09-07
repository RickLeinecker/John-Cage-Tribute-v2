// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'DB.dart';

// **************************************************************************
// DriftDatabaseGenerator
// **************************************************************************

// ignore_for_file: type=lint
class User extends DataClass implements Insertable<User> {
  final int userId;
  final String userName;
  final String password;
  final int email;
  final bool accountType;
  const User(
      {required this.userId,
      required this.userName,
      required this.password,
      required this.email,
      required this.accountType});
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['user_id'] = Variable<int>(userId);
    map['user_name'] = Variable<String>(userName);
    map['password'] = Variable<String>(password);
    map['email'] = Variable<int>(email);
    map['account_type'] = Variable<bool>(accountType);
    return map;
  }

  UsersCompanion toCompanion(bool nullToAbsent) {
    return UsersCompanion(
      userId: Value(userId),
      userName: Value(userName),
      password: Value(password),
      email: Value(email),
      accountType: Value(accountType),
    );
  }

  factory User.fromJson(Map<String, dynamic> json,
      {ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return User(
      userId: serializer.fromJson<int>(json['userId']),
      userName: serializer.fromJson<String>(json['userName']),
      password: serializer.fromJson<String>(json['password']),
      email: serializer.fromJson<int>(json['email']),
      accountType: serializer.fromJson<bool>(json['accountType']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'userId': serializer.toJson<int>(userId),
      'userName': serializer.toJson<String>(userName),
      'password': serializer.toJson<String>(password),
      'email': serializer.toJson<int>(email),
      'accountType': serializer.toJson<bool>(accountType),
    };
  }

  User copyWith(
          {int? userId,
          String? userName,
          String? password,
          int? email,
          bool? accountType}) =>
      User(
        userId: userId ?? this.userId,
        userName: userName ?? this.userName,
        password: password ?? this.password,
        email: email ?? this.email,
        accountType: accountType ?? this.accountType,
      );
  @override
  String toString() {
    return (StringBuffer('User(')
          ..write('userId: $userId, ')
          ..write('userName: $userName, ')
          ..write('password: $password, ')
          ..write('email: $email, ')
          ..write('accountType: $accountType')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode =>
      Object.hash(userId, userName, password, email, accountType);
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is User &&
          other.userId == this.userId &&
          other.userName == this.userName &&
          other.password == this.password &&
          other.email == this.email &&
          other.accountType == this.accountType);
}

class UsersCompanion extends UpdateCompanion<User> {
  final Value<int> userId;
  final Value<String> userName;
  final Value<String> password;
  final Value<int> email;
  final Value<bool> accountType;
  const UsersCompanion({
    this.userId = const Value.absent(),
    this.userName = const Value.absent(),
    this.password = const Value.absent(),
    this.email = const Value.absent(),
    this.accountType = const Value.absent(),
  });
  UsersCompanion.insert({
    this.userId = const Value.absent(),
    required String userName,
    required String password,
    required int email,
    this.accountType = const Value.absent(),
  })  : userName = Value(userName),
        password = Value(password),
        email = Value(email);
  static Insertable<User> custom({
    Expression<int>? userId,
    Expression<String>? userName,
    Expression<String>? password,
    Expression<int>? email,
    Expression<bool>? accountType,
  }) {
    return RawValuesInsertable({
      if (userId != null) 'user_id': userId,
      if (userName != null) 'user_name': userName,
      if (password != null) 'password': password,
      if (email != null) 'email': email,
      if (accountType != null) 'account_type': accountType,
    });
  }

  UsersCompanion copyWith(
      {Value<int>? userId,
      Value<String>? userName,
      Value<String>? password,
      Value<int>? email,
      Value<bool>? accountType}) {
    return UsersCompanion(
      userId: userId ?? this.userId,
      userName: userName ?? this.userName,
      password: password ?? this.password,
      email: email ?? this.email,
      accountType: accountType ?? this.accountType,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (userId.present) {
      map['user_id'] = Variable<int>(userId.value);
    }
    if (userName.present) {
      map['user_name'] = Variable<String>(userName.value);
    }
    if (password.present) {
      map['password'] = Variable<String>(password.value);
    }
    if (email.present) {
      map['email'] = Variable<int>(email.value);
    }
    if (accountType.present) {
      map['account_type'] = Variable<bool>(accountType.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('UsersCompanion(')
          ..write('userId: $userId, ')
          ..write('userName: $userName, ')
          ..write('password: $password, ')
          ..write('email: $email, ')
          ..write('accountType: $accountType')
          ..write(')'))
        .toString();
  }
}

class $UsersTable extends Users with TableInfo<$UsersTable, User> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  $UsersTable(this.attachedDatabase, [this._alias]);
  final VerificationMeta _userIdMeta = const VerificationMeta('userId');
  @override
  late final GeneratedColumn<int> userId = GeneratedColumn<int>(
      'user_id', aliasedName, false,
      type: DriftSqlType.int,
      requiredDuringInsert: false,
      defaultConstraints: 'PRIMARY KEY AUTOINCREMENT');
  final VerificationMeta _userNameMeta = const VerificationMeta('userName');
  @override
  late final GeneratedColumn<String> userName = GeneratedColumn<String>(
      'user_name', aliasedName, false,
      additionalChecks: GeneratedColumn.checkTextLength(maxTextLength: 32),
      type: DriftSqlType.string,
      requiredDuringInsert: true,
      defaultConstraints: 'UNIQUE');
  final VerificationMeta _passwordMeta = const VerificationMeta('password');
  @override
  late final GeneratedColumn<String> password = GeneratedColumn<String>(
      'password', aliasedName, false,
      additionalChecks:
          GeneratedColumn.checkTextLength(minTextLength: 8, maxTextLength: 32),
      type: DriftSqlType.string,
      requiredDuringInsert: true);
  final VerificationMeta _emailMeta = const VerificationMeta('email');
  @override
  late final GeneratedColumn<int> email = GeneratedColumn<int>(
      'email', aliasedName, false,
      type: DriftSqlType.int,
      requiredDuringInsert: true,
      defaultConstraints: 'UNIQUE');
  final VerificationMeta _accountTypeMeta =
      const VerificationMeta('accountType');
  @override
  late final GeneratedColumn<bool> accountType = GeneratedColumn<bool>(
      'account_type', aliasedName, false,
      type: DriftSqlType.bool,
      requiredDuringInsert: false,
      defaultConstraints: 'CHECK (account_type IN (0, 1))',
      clientDefault: () => false);
  @override
  List<GeneratedColumn> get $columns =>
      [userId, userName, password, email, accountType];
  @override
  String get aliasedName => _alias ?? 'users';
  @override
  String get actualTableName => 'users';
  @override
  VerificationContext validateIntegrity(Insertable<User> instance,
      {bool isInserting = false}) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('user_id')) {
      context.handle(_userIdMeta,
          userId.isAcceptableOrUnknown(data['user_id']!, _userIdMeta));
    }
    if (data.containsKey('user_name')) {
      context.handle(_userNameMeta,
          userName.isAcceptableOrUnknown(data['user_name']!, _userNameMeta));
    } else if (isInserting) {
      context.missing(_userNameMeta);
    }
    if (data.containsKey('password')) {
      context.handle(_passwordMeta,
          password.isAcceptableOrUnknown(data['password']!, _passwordMeta));
    } else if (isInserting) {
      context.missing(_passwordMeta);
    }
    if (data.containsKey('email')) {
      context.handle(
          _emailMeta, email.isAcceptableOrUnknown(data['email']!, _emailMeta));
    } else if (isInserting) {
      context.missing(_emailMeta);
    }
    if (data.containsKey('account_type')) {
      context.handle(
          _accountTypeMeta,
          accountType.isAcceptableOrUnknown(
              data['account_type']!, _accountTypeMeta));
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {userId};
  @override
  User map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return User(
      userId: attachedDatabase.options.types
          .read(DriftSqlType.int, data['${effectivePrefix}user_id'])!,
      userName: attachedDatabase.options.types
          .read(DriftSqlType.string, data['${effectivePrefix}user_name'])!,
      password: attachedDatabase.options.types
          .read(DriftSqlType.string, data['${effectivePrefix}password'])!,
      email: attachedDatabase.options.types
          .read(DriftSqlType.int, data['${effectivePrefix}email'])!,
      accountType: attachedDatabase.options.types
          .read(DriftSqlType.bool, data['${effectivePrefix}account_type'])!,
    );
  }

  @override
  $UsersTable createAlias(String alias) {
    return $UsersTable(attachedDatabase, alias);
  }
}

class Recording extends DataClass implements Insertable<Recording> {
  final int recordingId;
  final int maestroId;
  final String title;
  final int lengthSeconds;
  final String audioFile;
  final int recordingDate;
  final int inContest;
  const Recording(
      {required this.recordingId,
      required this.maestroId,
      required this.title,
      required this.lengthSeconds,
      required this.audioFile,
      required this.recordingDate,
      required this.inContest});
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['recording_id'] = Variable<int>(recordingId);
    map['maestro_id'] = Variable<int>(maestroId);
    map['title'] = Variable<String>(title);
    map['length_seconds'] = Variable<int>(lengthSeconds);
    map['audio_file'] = Variable<String>(audioFile);
    map['recording_date'] = Variable<int>(recordingDate);
    map['in_contest'] = Variable<int>(inContest);
    return map;
  }

  RecordingsCompanion toCompanion(bool nullToAbsent) {
    return RecordingsCompanion(
      recordingId: Value(recordingId),
      maestroId: Value(maestroId),
      title: Value(title),
      lengthSeconds: Value(lengthSeconds),
      audioFile: Value(audioFile),
      recordingDate: Value(recordingDate),
      inContest: Value(inContest),
    );
  }

  factory Recording.fromJson(Map<String, dynamic> json,
      {ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return Recording(
      recordingId: serializer.fromJson<int>(json['recordingId']),
      maestroId: serializer.fromJson<int>(json['maestroId']),
      title: serializer.fromJson<String>(json['title']),
      lengthSeconds: serializer.fromJson<int>(json['lengthSeconds']),
      audioFile: serializer.fromJson<String>(json['audioFile']),
      recordingDate: serializer.fromJson<int>(json['recordingDate']),
      inContest: serializer.fromJson<int>(json['inContest']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'recordingId': serializer.toJson<int>(recordingId),
      'maestroId': serializer.toJson<int>(maestroId),
      'title': serializer.toJson<String>(title),
      'lengthSeconds': serializer.toJson<int>(lengthSeconds),
      'audioFile': serializer.toJson<String>(audioFile),
      'recordingDate': serializer.toJson<int>(recordingDate),
      'inContest': serializer.toJson<int>(inContest),
    };
  }

  Recording copyWith(
          {int? recordingId,
          int? maestroId,
          String? title,
          int? lengthSeconds,
          String? audioFile,
          int? recordingDate,
          int? inContest}) =>
      Recording(
        recordingId: recordingId ?? this.recordingId,
        maestroId: maestroId ?? this.maestroId,
        title: title ?? this.title,
        lengthSeconds: lengthSeconds ?? this.lengthSeconds,
        audioFile: audioFile ?? this.audioFile,
        recordingDate: recordingDate ?? this.recordingDate,
        inContest: inContest ?? this.inContest,
      );
  @override
  String toString() {
    return (StringBuffer('Recording(')
          ..write('recordingId: $recordingId, ')
          ..write('maestroId: $maestroId, ')
          ..write('title: $title, ')
          ..write('lengthSeconds: $lengthSeconds, ')
          ..write('audioFile: $audioFile, ')
          ..write('recordingDate: $recordingDate, ')
          ..write('inContest: $inContest')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode => Object.hash(recordingId, maestroId, title, lengthSeconds,
      audioFile, recordingDate, inContest);
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is Recording &&
          other.recordingId == this.recordingId &&
          other.maestroId == this.maestroId &&
          other.title == this.title &&
          other.lengthSeconds == this.lengthSeconds &&
          other.audioFile == this.audioFile &&
          other.recordingDate == this.recordingDate &&
          other.inContest == this.inContest);
}

class RecordingsCompanion extends UpdateCompanion<Recording> {
  final Value<int> recordingId;
  final Value<int> maestroId;
  final Value<String> title;
  final Value<int> lengthSeconds;
  final Value<String> audioFile;
  final Value<int> recordingDate;
  final Value<int> inContest;
  const RecordingsCompanion({
    this.recordingId = const Value.absent(),
    this.maestroId = const Value.absent(),
    this.title = const Value.absent(),
    this.lengthSeconds = const Value.absent(),
    this.audioFile = const Value.absent(),
    this.recordingDate = const Value.absent(),
    this.inContest = const Value.absent(),
  });
  RecordingsCompanion.insert({
    this.recordingId = const Value.absent(),
    required int maestroId,
    required String title,
    required int lengthSeconds,
    required String audioFile,
    required int recordingDate,
    required int inContest,
  })  : maestroId = Value(maestroId),
        title = Value(title),
        lengthSeconds = Value(lengthSeconds),
        audioFile = Value(audioFile),
        recordingDate = Value(recordingDate),
        inContest = Value(inContest);
  static Insertable<Recording> custom({
    Expression<int>? recordingId,
    Expression<int>? maestroId,
    Expression<String>? title,
    Expression<int>? lengthSeconds,
    Expression<String>? audioFile,
    Expression<int>? recordingDate,
    Expression<int>? inContest,
  }) {
    return RawValuesInsertable({
      if (recordingId != null) 'recording_id': recordingId,
      if (maestroId != null) 'maestro_id': maestroId,
      if (title != null) 'title': title,
      if (lengthSeconds != null) 'length_seconds': lengthSeconds,
      if (audioFile != null) 'audio_file': audioFile,
      if (recordingDate != null) 'recording_date': recordingDate,
      if (inContest != null) 'in_contest': inContest,
    });
  }

  RecordingsCompanion copyWith(
      {Value<int>? recordingId,
      Value<int>? maestroId,
      Value<String>? title,
      Value<int>? lengthSeconds,
      Value<String>? audioFile,
      Value<int>? recordingDate,
      Value<int>? inContest}) {
    return RecordingsCompanion(
      recordingId: recordingId ?? this.recordingId,
      maestroId: maestroId ?? this.maestroId,
      title: title ?? this.title,
      lengthSeconds: lengthSeconds ?? this.lengthSeconds,
      audioFile: audioFile ?? this.audioFile,
      recordingDate: recordingDate ?? this.recordingDate,
      inContest: inContest ?? this.inContest,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (recordingId.present) {
      map['recording_id'] = Variable<int>(recordingId.value);
    }
    if (maestroId.present) {
      map['maestro_id'] = Variable<int>(maestroId.value);
    }
    if (title.present) {
      map['title'] = Variable<String>(title.value);
    }
    if (lengthSeconds.present) {
      map['length_seconds'] = Variable<int>(lengthSeconds.value);
    }
    if (audioFile.present) {
      map['audio_file'] = Variable<String>(audioFile.value);
    }
    if (recordingDate.present) {
      map['recording_date'] = Variable<int>(recordingDate.value);
    }
    if (inContest.present) {
      map['in_contest'] = Variable<int>(inContest.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('RecordingsCompanion(')
          ..write('recordingId: $recordingId, ')
          ..write('maestroId: $maestroId, ')
          ..write('title: $title, ')
          ..write('lengthSeconds: $lengthSeconds, ')
          ..write('audioFile: $audioFile, ')
          ..write('recordingDate: $recordingDate, ')
          ..write('inContest: $inContest')
          ..write(')'))
        .toString();
  }
}

class $RecordingsTable extends Recordings
    with TableInfo<$RecordingsTable, Recording> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  $RecordingsTable(this.attachedDatabase, [this._alias]);
  final VerificationMeta _recordingIdMeta =
      const VerificationMeta('recordingId');
  @override
  late final GeneratedColumn<int> recordingId = GeneratedColumn<int>(
      'recording_id', aliasedName, false,
      type: DriftSqlType.int,
      requiredDuringInsert: false,
      defaultConstraints: 'PRIMARY KEY AUTOINCREMENT');
  final VerificationMeta _maestroIdMeta = const VerificationMeta('maestroId');
  @override
  late final GeneratedColumn<int> maestroId = GeneratedColumn<int>(
      'maestro_id', aliasedName, false,
      type: DriftSqlType.int,
      requiredDuringInsert: true,
      defaultConstraints: 'REFERENCES users (user_id)');
  final VerificationMeta _titleMeta = const VerificationMeta('title');
  @override
  late final GeneratedColumn<String> title = GeneratedColumn<String>(
      'title', aliasedName, false,
      additionalChecks: GeneratedColumn.checkTextLength(maxTextLength: 255),
      type: DriftSqlType.string,
      requiredDuringInsert: true,
      defaultConstraints: 'UNIQUE');
  final VerificationMeta _lengthSecondsMeta =
      const VerificationMeta('lengthSeconds');
  @override
  late final GeneratedColumn<int> lengthSeconds = GeneratedColumn<int>(
      'length_seconds', aliasedName, false,
      type: DriftSqlType.int, requiredDuringInsert: true);
  final VerificationMeta _audioFileMeta = const VerificationMeta('audioFile');
  @override
  late final GeneratedColumn<String> audioFile = GeneratedColumn<String>(
      'audio_file', aliasedName, false,
      additionalChecks: GeneratedColumn.checkTextLength(maxTextLength: 255),
      type: DriftSqlType.string,
      requiredDuringInsert: true);
  final VerificationMeta _recordingDateMeta =
      const VerificationMeta('recordingDate');
  @override
  late final GeneratedColumn<int> recordingDate = GeneratedColumn<int>(
      'recording_date', aliasedName, false,
      type: DriftSqlType.int, requiredDuringInsert: true);
  final VerificationMeta _inContestMeta = const VerificationMeta('inContest');
  @override
  late final GeneratedColumn<int> inContest = GeneratedColumn<int>(
      'in_contest', aliasedName, false,
      type: DriftSqlType.int, requiredDuringInsert: true);
  @override
  List<GeneratedColumn> get $columns => [
        recordingId,
        maestroId,
        title,
        lengthSeconds,
        audioFile,
        recordingDate,
        inContest
      ];
  @override
  String get aliasedName => _alias ?? 'recordings';
  @override
  String get actualTableName => 'recordings';
  @override
  VerificationContext validateIntegrity(Insertable<Recording> instance,
      {bool isInserting = false}) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('recording_id')) {
      context.handle(
          _recordingIdMeta,
          recordingId.isAcceptableOrUnknown(
              data['recording_id']!, _recordingIdMeta));
    }
    if (data.containsKey('maestro_id')) {
      context.handle(_maestroIdMeta,
          maestroId.isAcceptableOrUnknown(data['maestro_id']!, _maestroIdMeta));
    } else if (isInserting) {
      context.missing(_maestroIdMeta);
    }
    if (data.containsKey('title')) {
      context.handle(
          _titleMeta, title.isAcceptableOrUnknown(data['title']!, _titleMeta));
    } else if (isInserting) {
      context.missing(_titleMeta);
    }
    if (data.containsKey('length_seconds')) {
      context.handle(
          _lengthSecondsMeta,
          lengthSeconds.isAcceptableOrUnknown(
              data['length_seconds']!, _lengthSecondsMeta));
    } else if (isInserting) {
      context.missing(_lengthSecondsMeta);
    }
    if (data.containsKey('audio_file')) {
      context.handle(_audioFileMeta,
          audioFile.isAcceptableOrUnknown(data['audio_file']!, _audioFileMeta));
    } else if (isInserting) {
      context.missing(_audioFileMeta);
    }
    if (data.containsKey('recording_date')) {
      context.handle(
          _recordingDateMeta,
          recordingDate.isAcceptableOrUnknown(
              data['recording_date']!, _recordingDateMeta));
    } else if (isInserting) {
      context.missing(_recordingDateMeta);
    }
    if (data.containsKey('in_contest')) {
      context.handle(_inContestMeta,
          inContest.isAcceptableOrUnknown(data['in_contest']!, _inContestMeta));
    } else if (isInserting) {
      context.missing(_inContestMeta);
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {recordingId};
  @override
  Recording map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return Recording(
      recordingId: attachedDatabase.options.types
          .read(DriftSqlType.int, data['${effectivePrefix}recording_id'])!,
      maestroId: attachedDatabase.options.types
          .read(DriftSqlType.int, data['${effectivePrefix}maestro_id'])!,
      title: attachedDatabase.options.types
          .read(DriftSqlType.string, data['${effectivePrefix}title'])!,
      lengthSeconds: attachedDatabase.options.types
          .read(DriftSqlType.int, data['${effectivePrefix}length_seconds'])!,
      audioFile: attachedDatabase.options.types
          .read(DriftSqlType.string, data['${effectivePrefix}audio_file'])!,
      recordingDate: attachedDatabase.options.types
          .read(DriftSqlType.int, data['${effectivePrefix}recording_date'])!,
      inContest: attachedDatabase.options.types
          .read(DriftSqlType.int, data['${effectivePrefix}in_contest'])!,
    );
  }

  @override
  $RecordingsTable createAlias(String alias) {
    return $RecordingsTable(attachedDatabase, alias);
  }
}

class UserRecording extends DataClass implements Insertable<UserRecording> {
  final int userId;
  final int recordingId;
  const UserRecording({required this.userId, required this.recordingId});
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['user_id'] = Variable<int>(userId);
    map['recording_id'] = Variable<int>(recordingId);
    return map;
  }

  UserRecordingsCompanion toCompanion(bool nullToAbsent) {
    return UserRecordingsCompanion(
      userId: Value(userId),
      recordingId: Value(recordingId),
    );
  }

  factory UserRecording.fromJson(Map<String, dynamic> json,
      {ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return UserRecording(
      userId: serializer.fromJson<int>(json['userId']),
      recordingId: serializer.fromJson<int>(json['recordingId']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'userId': serializer.toJson<int>(userId),
      'recordingId': serializer.toJson<int>(recordingId),
    };
  }

  UserRecording copyWith({int? userId, int? recordingId}) => UserRecording(
        userId: userId ?? this.userId,
        recordingId: recordingId ?? this.recordingId,
      );
  @override
  String toString() {
    return (StringBuffer('UserRecording(')
          ..write('userId: $userId, ')
          ..write('recordingId: $recordingId')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode => Object.hash(userId, recordingId);
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is UserRecording &&
          other.userId == this.userId &&
          other.recordingId == this.recordingId);
}

class UserRecordingsCompanion extends UpdateCompanion<UserRecording> {
  final Value<int> userId;
  final Value<int> recordingId;
  const UserRecordingsCompanion({
    this.userId = const Value.absent(),
    this.recordingId = const Value.absent(),
  });
  UserRecordingsCompanion.insert({
    required int userId,
    required int recordingId,
  })  : userId = Value(userId),
        recordingId = Value(recordingId);
  static Insertable<UserRecording> custom({
    Expression<int>? userId,
    Expression<int>? recordingId,
  }) {
    return RawValuesInsertable({
      if (userId != null) 'user_id': userId,
      if (recordingId != null) 'recording_id': recordingId,
    });
  }

  UserRecordingsCompanion copyWith(
      {Value<int>? userId, Value<int>? recordingId}) {
    return UserRecordingsCompanion(
      userId: userId ?? this.userId,
      recordingId: recordingId ?? this.recordingId,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (userId.present) {
      map['user_id'] = Variable<int>(userId.value);
    }
    if (recordingId.present) {
      map['recording_id'] = Variable<int>(recordingId.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('UserRecordingsCompanion(')
          ..write('userId: $userId, ')
          ..write('recordingId: $recordingId')
          ..write(')'))
        .toString();
  }
}

class $UserRecordingsTable extends UserRecordings
    with TableInfo<$UserRecordingsTable, UserRecording> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  $UserRecordingsTable(this.attachedDatabase, [this._alias]);
  final VerificationMeta _userIdMeta = const VerificationMeta('userId');
  @override
  late final GeneratedColumn<int> userId = GeneratedColumn<int>(
      'user_id', aliasedName, false,
      type: DriftSqlType.int,
      requiredDuringInsert: true,
      defaultConstraints: 'REFERENCES users (user_id)');
  final VerificationMeta _recordingIdMeta =
      const VerificationMeta('recordingId');
  @override
  late final GeneratedColumn<int> recordingId = GeneratedColumn<int>(
      'recording_id', aliasedName, false,
      type: DriftSqlType.int,
      requiredDuringInsert: true,
      defaultConstraints: 'REFERENCES recordings (recording_id)');
  @override
  List<GeneratedColumn> get $columns => [userId, recordingId];
  @override
  String get aliasedName => _alias ?? 'user_recordings';
  @override
  String get actualTableName => 'user_recordings';
  @override
  VerificationContext validateIntegrity(Insertable<UserRecording> instance,
      {bool isInserting = false}) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('user_id')) {
      context.handle(_userIdMeta,
          userId.isAcceptableOrUnknown(data['user_id']!, _userIdMeta));
    } else if (isInserting) {
      context.missing(_userIdMeta);
    }
    if (data.containsKey('recording_id')) {
      context.handle(
          _recordingIdMeta,
          recordingId.isAcceptableOrUnknown(
              data['recording_id']!, _recordingIdMeta));
    } else if (isInserting) {
      context.missing(_recordingIdMeta);
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => <GeneratedColumn>{};
  @override
  UserRecording map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return UserRecording(
      userId: attachedDatabase.options.types
          .read(DriftSqlType.int, data['${effectivePrefix}user_id'])!,
      recordingId: attachedDatabase.options.types
          .read(DriftSqlType.int, data['${effectivePrefix}recording_id'])!,
    );
  }

  @override
  $UserRecordingsTable createAlias(String alias) {
    return $UserRecordingsTable(attachedDatabase, alias);
  }
}

class Contest extends DataClass implements Insertable<Contest> {
  final int contestId;
  final int recordingIdFirst;
  final int recordingIdSecond;
  final int recordingIdThird;
  const Contest(
      {required this.contestId,
      required this.recordingIdFirst,
      required this.recordingIdSecond,
      required this.recordingIdThird});
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['contest_id'] = Variable<int>(contestId);
    map['recording_id_first'] = Variable<int>(recordingIdFirst);
    map['recording_id_second'] = Variable<int>(recordingIdSecond);
    map['recording_id_third'] = Variable<int>(recordingIdThird);
    return map;
  }

  ContestsCompanion toCompanion(bool nullToAbsent) {
    return ContestsCompanion(
      contestId: Value(contestId),
      recordingIdFirst: Value(recordingIdFirst),
      recordingIdSecond: Value(recordingIdSecond),
      recordingIdThird: Value(recordingIdThird),
    );
  }

  factory Contest.fromJson(Map<String, dynamic> json,
      {ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return Contest(
      contestId: serializer.fromJson<int>(json['contestId']),
      recordingIdFirst: serializer.fromJson<int>(json['recordingIdFirst']),
      recordingIdSecond: serializer.fromJson<int>(json['recordingIdSecond']),
      recordingIdThird: serializer.fromJson<int>(json['recordingIdThird']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'contestId': serializer.toJson<int>(contestId),
      'recordingIdFirst': serializer.toJson<int>(recordingIdFirst),
      'recordingIdSecond': serializer.toJson<int>(recordingIdSecond),
      'recordingIdThird': serializer.toJson<int>(recordingIdThird),
    };
  }

  Contest copyWith(
          {int? contestId,
          int? recordingIdFirst,
          int? recordingIdSecond,
          int? recordingIdThird}) =>
      Contest(
        contestId: contestId ?? this.contestId,
        recordingIdFirst: recordingIdFirst ?? this.recordingIdFirst,
        recordingIdSecond: recordingIdSecond ?? this.recordingIdSecond,
        recordingIdThird: recordingIdThird ?? this.recordingIdThird,
      );
  @override
  String toString() {
    return (StringBuffer('Contest(')
          ..write('contestId: $contestId, ')
          ..write('recordingIdFirst: $recordingIdFirst, ')
          ..write('recordingIdSecond: $recordingIdSecond, ')
          ..write('recordingIdThird: $recordingIdThird')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode => Object.hash(
      contestId, recordingIdFirst, recordingIdSecond, recordingIdThird);
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is Contest &&
          other.contestId == this.contestId &&
          other.recordingIdFirst == this.recordingIdFirst &&
          other.recordingIdSecond == this.recordingIdSecond &&
          other.recordingIdThird == this.recordingIdThird);
}

class ContestsCompanion extends UpdateCompanion<Contest> {
  final Value<int> contestId;
  final Value<int> recordingIdFirst;
  final Value<int> recordingIdSecond;
  final Value<int> recordingIdThird;
  const ContestsCompanion({
    this.contestId = const Value.absent(),
    this.recordingIdFirst = const Value.absent(),
    this.recordingIdSecond = const Value.absent(),
    this.recordingIdThird = const Value.absent(),
  });
  ContestsCompanion.insert({
    required int contestId,
    required int recordingIdFirst,
    required int recordingIdSecond,
    required int recordingIdThird,
  })  : contestId = Value(contestId),
        recordingIdFirst = Value(recordingIdFirst),
        recordingIdSecond = Value(recordingIdSecond),
        recordingIdThird = Value(recordingIdThird);
  static Insertable<Contest> custom({
    Expression<int>? contestId,
    Expression<int>? recordingIdFirst,
    Expression<int>? recordingIdSecond,
    Expression<int>? recordingIdThird,
  }) {
    return RawValuesInsertable({
      if (contestId != null) 'contest_id': contestId,
      if (recordingIdFirst != null) 'recording_id_first': recordingIdFirst,
      if (recordingIdSecond != null) 'recording_id_second': recordingIdSecond,
      if (recordingIdThird != null) 'recording_id_third': recordingIdThird,
    });
  }

  ContestsCompanion copyWith(
      {Value<int>? contestId,
      Value<int>? recordingIdFirst,
      Value<int>? recordingIdSecond,
      Value<int>? recordingIdThird}) {
    return ContestsCompanion(
      contestId: contestId ?? this.contestId,
      recordingIdFirst: recordingIdFirst ?? this.recordingIdFirst,
      recordingIdSecond: recordingIdSecond ?? this.recordingIdSecond,
      recordingIdThird: recordingIdThird ?? this.recordingIdThird,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (contestId.present) {
      map['contest_id'] = Variable<int>(contestId.value);
    }
    if (recordingIdFirst.present) {
      map['recording_id_first'] = Variable<int>(recordingIdFirst.value);
    }
    if (recordingIdSecond.present) {
      map['recording_id_second'] = Variable<int>(recordingIdSecond.value);
    }
    if (recordingIdThird.present) {
      map['recording_id_third'] = Variable<int>(recordingIdThird.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('ContestsCompanion(')
          ..write('contestId: $contestId, ')
          ..write('recordingIdFirst: $recordingIdFirst, ')
          ..write('recordingIdSecond: $recordingIdSecond, ')
          ..write('recordingIdThird: $recordingIdThird')
          ..write(')'))
        .toString();
  }
}

class $ContestsTable extends Contests with TableInfo<$ContestsTable, Contest> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  $ContestsTable(this.attachedDatabase, [this._alias]);
  final VerificationMeta _contestIdMeta = const VerificationMeta('contestId');
  @override
  late final GeneratedColumn<int> contestId = GeneratedColumn<int>(
      'contest_id', aliasedName, false,
      type: DriftSqlType.int, requiredDuringInsert: true);
  final VerificationMeta _recordingIdFirstMeta =
      const VerificationMeta('recordingIdFirst');
  @override
  late final GeneratedColumn<int> recordingIdFirst = GeneratedColumn<int>(
      'recording_id_first', aliasedName, false,
      type: DriftSqlType.int,
      requiredDuringInsert: true,
      defaultConstraints: 'REFERENCES recordings (recording_id)');
  final VerificationMeta _recordingIdSecondMeta =
      const VerificationMeta('recordingIdSecond');
  @override
  late final GeneratedColumn<int> recordingIdSecond = GeneratedColumn<int>(
      'recording_id_second', aliasedName, false,
      type: DriftSqlType.int,
      requiredDuringInsert: true,
      defaultConstraints: 'REFERENCES recordings (recording_id)');
  final VerificationMeta _recordingIdThirdMeta =
      const VerificationMeta('recordingIdThird');
  @override
  late final GeneratedColumn<int> recordingIdThird = GeneratedColumn<int>(
      'recording_id_third', aliasedName, false,
      type: DriftSqlType.int,
      requiredDuringInsert: true,
      defaultConstraints: 'REFERENCES recordings (recording_id)');
  @override
  List<GeneratedColumn> get $columns =>
      [contestId, recordingIdFirst, recordingIdSecond, recordingIdThird];
  @override
  String get aliasedName => _alias ?? 'contests';
  @override
  String get actualTableName => 'contests';
  @override
  VerificationContext validateIntegrity(Insertable<Contest> instance,
      {bool isInserting = false}) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('contest_id')) {
      context.handle(_contestIdMeta,
          contestId.isAcceptableOrUnknown(data['contest_id']!, _contestIdMeta));
    } else if (isInserting) {
      context.missing(_contestIdMeta);
    }
    if (data.containsKey('recording_id_first')) {
      context.handle(
          _recordingIdFirstMeta,
          recordingIdFirst.isAcceptableOrUnknown(
              data['recording_id_first']!, _recordingIdFirstMeta));
    } else if (isInserting) {
      context.missing(_recordingIdFirstMeta);
    }
    if (data.containsKey('recording_id_second')) {
      context.handle(
          _recordingIdSecondMeta,
          recordingIdSecond.isAcceptableOrUnknown(
              data['recording_id_second']!, _recordingIdSecondMeta));
    } else if (isInserting) {
      context.missing(_recordingIdSecondMeta);
    }
    if (data.containsKey('recording_id_third')) {
      context.handle(
          _recordingIdThirdMeta,
          recordingIdThird.isAcceptableOrUnknown(
              data['recording_id_third']!, _recordingIdThirdMeta));
    } else if (isInserting) {
      context.missing(_recordingIdThirdMeta);
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => <GeneratedColumn>{};
  @override
  Contest map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return Contest(
      contestId: attachedDatabase.options.types
          .read(DriftSqlType.int, data['${effectivePrefix}contest_id'])!,
      recordingIdFirst: attachedDatabase.options.types.read(
          DriftSqlType.int, data['${effectivePrefix}recording_id_first'])!,
      recordingIdSecond: attachedDatabase.options.types.read(
          DriftSqlType.int, data['${effectivePrefix}recording_id_second'])!,
      recordingIdThird: attachedDatabase.options.types.read(
          DriftSqlType.int, data['${effectivePrefix}recording_id_third'])!,
    );
  }

  @override
  $ContestsTable createAlias(String alias) {
    return $ContestsTable(attachedDatabase, alias);
  }
}

abstract class _$MyDatabase extends GeneratedDatabase {
  _$MyDatabase(QueryExecutor e) : super(e);
  late final $UsersTable users = $UsersTable(this);
  late final $RecordingsTable recordings = $RecordingsTable(this);
  late final $UserRecordingsTable userRecordings = $UserRecordingsTable(this);
  late final $ContestsTable contests = $ContestsTable(this);
  @override
  Iterable<TableInfo<Table, dynamic>> get allTables =>
      allSchemaEntities.whereType<TableInfo<Table, Object?>>();
  @override
  List<DatabaseSchemaEntity> get allSchemaEntities =>
      [users, recordings, userRecordings, contests];
}
