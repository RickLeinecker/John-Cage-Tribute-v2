import 'package:flutter/material.dart';

class Recordings extends StatelessWidget {
  Recordings({Key? key, required this.title}) : super(key: key);
  final String title;
  //This will be replaced by data from the database
  final List<Song> songs = [
    const Song(songTitle: "September"),
    const Song(songTitle: "Don't Stop Me Now"),
    const Song(songTitle: "Let It Go"),
    const Song(songTitle: "Smoke on the Water"),
    const Song(songTitle: "Don't Kill My Vibe"),
    const Song(songTitle: "Mamma Mia"),
    const Song(songTitle: "4'33"),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(title),
        actions: [
          IconButton(
              onPressed: () {
                showSearch(
                    context: context,
                    delegate: CustomSearchDelegate(searchTerms: songs));
              },
              icon: const Icon(Icons.search)),
        ],
      ),
      body: Container(
        color: Colors.grey[600],
        child: Center(
          child: ListView(
            children: songs,
          ),
        ),
      ),
    );
  }
}

class Song extends StatelessWidget {
  const Song({Key? key, required this.songTitle}) : super(key: key);
  final String songTitle;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(10),
      child: Container(
        alignment: Alignment.center,
        color: Colors.lightBlue[300],
        child: Text(
          songTitle,
          style: const TextStyle(color: Colors.black),
        ),
      ),
    );
  }

  String getSongTitle() {
    return songTitle;
  }
}

class CustomSearchDelegate extends SearchDelegate {
  CustomSearchDelegate({required this.searchTerms});
  final List<Song> searchTerms;

  @override
  List<Widget> buildActions(BuildContext context) {
    return [
      IconButton(
        onPressed: () {
          query = "";
        },
        icon: const Icon(Icons.clear),
      ),
    ];
  }

  @override
  Widget buildLeading(BuildContext context) {
    return IconButton(
      onPressed: () {
        close(context, null);
      },
      icon: const Icon(Icons.arrow_back),
    );
  }

  @override
  Widget buildResults(BuildContext context) {
    List<Song> matchQuery = [];
    //looping through each item in searchTerms
    for (var song in searchTerms) {
      if (song.getSongTitle().toLowerCase().contains(query.toLowerCase())) {
        //ERROR OCCURS HERE
        matchQuery.add(song);
      }
    }
    return ListView.builder(
      itemCount: matchQuery.length,
      itemBuilder: ((context, index) {
        var result = matchQuery[index].getSongTitle();
        return ListTile(
          title: Text(result),
        );
      }),
    );
  }

  @override
  Widget buildSuggestions(BuildContext context) {
    List<Song> matchQuery = [];
    //looping through each item in searchTerms
    for (var song in searchTerms) {
      if (song.getSongTitle().toLowerCase().contains(query.toLowerCase())) {
        //ERROR OCCURS HERE
        matchQuery.add(song);
      }
    }
    return ListView.builder(
      itemCount: matchQuery.length,
      itemBuilder: ((context, index) {
        var result = matchQuery[index].getSongTitle();
        return ListTile(
          title: Text(result),
        );
      }),
    );
  }
}

/*

class _PerformScreenState extends State<PerformScreen> {
  FlutterAudioRecorder _recorder;
  Recording _recording;
  Timer _t;
  Widget _buttonIcon = Icon(Icons.do_not_disturb_on);
  String _alert;

  @override
  void initState() {
    super.initState();
    Future.microtask(() {
      _prepare();
    });
  }

  void _opt() async {
    switch (_recording.status) {
      case RecordingStatus.Initialized:
        {
          await _startRecording();
          break;
        }
      case RecordingStatus.Recording:
        {
          await _stopRecording();
          break;
        }
      case RecordingStatus.Stopped:
        {
          await _prepare();
          break;
        }

      default:
        break;
    }

    // 刷新按钮
    setState(() {
      _buttonIcon = _playerIcon(_recording.status);
    });
  }

  Future _init() async {
    String customPath = '/flutter_audio_recorder_';
    Directory appDocDirectory;
    if (Platform.isIOS) {
      appDocDirectory = await getApplicationDocumentsDirectory();
    } else {
      appDocDirectory = await getExternalStorageDirectory();
    }

    // can add extension like ".mp4" ".wav" ".m4a" ".aac"
    customPath = appDocDirectory.path +
        customPath +
        DateTime.now().millisecondsSinceEpoch.toString();

    // .wav <---> AudioFormat.WAV
    // .mp4 .m4a .aac <---> AudioFormat.AAC
    // AudioFormat is optional, if given value, will overwrite path extension when there is conflicts.

    _recorder = FlutterAudioRecorder(customPath,
        audioFormat: AudioFormat.WAV, sampleRate: 44100);

    await _recorder.initialized;
  }

  Future _prepare() async {
    var hasPermission = await FlutterAudioRecorder.hasPermissions;
    if (hasPermission) {
      print("hasPermissions successful.");
      await _init();

      var result = await _recorder.current();
      setState(() {
        _recording = result;
        _buttonIcon = _playerIcon(_recording.status);
        _alert = "";
      });
    } else {
      setState(() {
        _alert = "Permission Required.";
      });
    }
  }

  Future _startRecording() async {
    await _recorder.start();
    var current = await _recorder.current();
    setState(() {
      _recording = current;
    });

    _t = Timer.periodic(Duration(milliseconds: 10), (Timer t) async {
      var current = await _recorder.current();
      setState(() {
        _recording = current;
        _t = t;
      });
    });
  }

  Future _stopRecording() async {
    var result = await _recorder.stop();
    _t.cancel();

    setState(() {
      _recording = result;
    });
  }

  void _play() {
    AudioPlayer player = AudioPlayer();
    player.play(_recording.path, isLocal: true);
  }

  Widget _playerIcon(RecordingStatus status) {
    switch (status) {
      case RecordingStatus.Initialized:
        {
          return Icon(Icons.fiber_manual_record);
        }
      case RecordingStatus.Recording:
        {
          return Icon(Icons.stop);
        }
      case RecordingStatus.Stopped:
        {
          return Icon(Icons.replay);
        }
      default:
        return Icon(Icons.do_not_disturb_on);
    }
  }

  Widget audioDataWidget() {
    if (_recorder != null) {
      return Column(
        children: [
          StreamBuilder(
            stream: _recorder.ws, // websocket
            builder: (BuildContext context, snapshot) {
              return Text(snapshot.hasData ? "_audioSnippet's length is ${snapshot.data.length}." : "waiting...");
            }
          ),
          SizedBox(
            height: 20,
          ),
        ]
      );
    } else {
      return Text("Recorder not yet initialized.");
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        automaticallyImplyLeading: false,
        title: Text("Audio Recording"),
      ),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(40.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[
              Text(
                'File',
                style: Theme.of(context).textTheme.title,
              ),
              SizedBox(
                height: 5,
              ),
              Text(
                '${_recording?.path ?? "-"}',
                style: Theme.of(context).textTheme.body1,
              ),
              SizedBox(
                height: 20,
              ),
              Text(
                'Duration',
                style: Theme.of(context).textTheme.title,
              ),
              SizedBox(
                height: 5,
              ),
              Text(
                '${_recording?.duration ?? "-"}',
                style: Theme.of(context).textTheme.body1,
              ),
              SizedBox(
                height: 20,
              ),
              Text(
                'Metering Level - Average Power',
                style: Theme.of(context).textTheme.title,
              ),
              SizedBox(
                height: 5,
              ),
              Text(
                '${_recording?.metering?.averagePower ?? "-"}',
                style: Theme.of(context).textTheme.body1,
              ),
              SizedBox(
                height: 20,
              ),
              Text(
                'Status',
                style: Theme.of(context).textTheme.title,
              ),
              SizedBox(
                height: 5,
              ),
              Text(
                '${_recording?.status ?? "-"}',
                style: Theme.of(context).textTheme.body1,
              ),
              SizedBox(
                height: 20,
              ),
              audioDataWidget(),
              RaisedButton(
                child: Text('Play'),
                disabledTextColor: Colors.white,
                disabledColor: Colors.grey.withOpacity(0.5),
                onPressed: _recording?.status == RecordingStatus.Stopped
                    ? _play
                    : null,
              ),
              SizedBox(
                height: 20,
              ),
              Text(
                '${_alert ?? ""}',
                style: Theme.of(context)
                    .textTheme
                    .title
                    .copyWith(color: Colors.red),
              ),
            ],
          ),
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: _opt,
        child: _buttonIcon,
      ),
    );
 */