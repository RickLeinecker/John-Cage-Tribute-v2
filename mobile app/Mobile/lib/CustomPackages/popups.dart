import 'package:flutter/material.dart';

void displayErr(BuildContext context, String message) {
  showDialog(
      context: context,
      barrierDismissible: false,
      builder: (BuildContext context) {
        return AlertDialog(
            title: const Text("Error Joining Room"),
            content: Text(message),
            actions: <Widget>[
              TextButton(
                  child: Text("Close"),
                  onPressed: () {
                    Navigator.of(context).pop();
                  })
            ]);
      });
}
