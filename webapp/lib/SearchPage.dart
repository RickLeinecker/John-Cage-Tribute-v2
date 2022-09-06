import 'package:flutter/material.dart';

class SearchPage extends StatelessWidget {
  SearchPage({Key? key, required this.title}) : super(key: key);
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
