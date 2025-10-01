import 'dart:convert';
import 'package:http/http.dart' as http;

class ApiService {
  static const String baseUrl = 'http://localhost:3003';
  static const String aiBaseUrl = 'http://localhost:3009';
  static const String fileBaseUrl = 'http://localhost:3006';
  static const String videoBaseUrl = 'http://localhost:3008';

  static final ApiService _instance = ApiService._internal();
  factory ApiService() => _instance;
  ApiService._internal();

  final http.Client _client = http.Client();

  // Player Service Methods
  Future<List<dynamic>> getPlayers({Map<String, String>? filters}) async {
    try {
      final queryParams = filters != null ? '?${Uri(queryParameters: filters).query}' : '';
      final response = await _client.get(Uri.parse('$baseUrl/players$queryParams'));
      
      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        return data['players'] ?? [];
      } else {
        throw Exception('Failed to load players: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Failed to load players: $e');
    }
  }

  Future<dynamic> getPlayer(String id) async {
    try {
      final response = await _client.get(Uri.parse('$baseUrl/players/$id'));
      
      if (response.statusCode == 200) {
        return json.decode(response.body);
      } else {
        throw Exception('Failed to load player: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Failed to load player: $e');
    }
  }

  // AI Service Methods
  Future<List<dynamic>> discoverTalent(Map<String, dynamic> criteria) async {
    try {
      final response = await _client.post(
        Uri.parse('$aiBaseUrl/api/ai/talent-discovery'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode(criteria),
      );
      
      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        return data['data']['players'] ?? [];
      } else {
        throw Exception('Failed to discover talent: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Failed to discover talent: $e');
    }
  }

  // File Service Methods
  Future<dynamic> uploadVideo(List<int> videoBytes, String filename) async {
    try {
      final request = http.MultipartRequest(
        'POST',
        Uri.parse('$fileBaseUrl/api/videos/upload'),
      );
      
      request.files.add(http.MultipartFile.fromBytes(
        'video',
        videoBytes,
        filename: filename,
      ));
      
      final response = await _client.send(request);
      final responseBody = await response.stream.bytesToString();
      
      if (response.statusCode == 200) {
        return json.decode(responseBody);
      } else {
        throw Exception('Failed to upload video: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Failed to upload video: $e');
    }
  }

  // Video Service Methods
  Future<dynamic> analyzeVideo(String videoId) async {
    try {
      final response = await _client.get(
        Uri.parse('$videoBaseUrl/api/videos/analysis/$videoId'),
      );
      
      if (response.statusCode == 200) {
        return json.decode(response.body);
      } else {
        throw Exception('Failed to analyze video: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Failed to analyze video: $e');
    }
  }
}
