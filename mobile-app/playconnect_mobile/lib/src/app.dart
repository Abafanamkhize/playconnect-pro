import 'package:flutter/material.dart';
import 'package:playconnect_mobile/src/core/themes/app_theme.dart';
import 'package:playconnect_mobile/src/features/auth/presentation/pages/login_page.dart';

class PlayConnectApp extends StatelessWidget {
  const PlayConnectApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'PlayConnect',
      theme: AppTheme.lightTheme,
      darkTheme: AppTheme.darkTheme,
      home: const LoginPage(),
      debugShowCheckedModeBanner: false,
    );
  }
}
