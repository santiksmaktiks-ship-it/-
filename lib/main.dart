import 'package:flutter/material.dart';

void main() => runApp(const NovaApp());

const novaAccent = Color(0xFF8B7CFF);
const novaBg = Color(0xFF101116);
const novaPanel = Color(0xFF191B24);

class NovaApp extends StatelessWidget {
  const NovaApp({super.key});

  @override
  Widget build(BuildContext context) => MaterialApp(
        title: 'NOVA',
        debugShowCheckedModeBanner: false,
        theme: ThemeData(
          brightness: Brightness.dark,
          scaffoldBackgroundColor: novaBg,
          colorScheme: ColorScheme.fromSeed(
            seedColor: novaAccent,
            brightness: Brightness.dark,
            surface: novaPanel,
          ),
          useMaterial3: true,
        ),
        home: const NovaHome(),
      );
}

class NovaHome extends StatefulWidget {
  const NovaHome({super.key});

  @override
  State<NovaHome> createState() => _NovaHomeState();
}

class _NovaHomeState extends State<NovaHome> {
  int selected = 0;
  int activeServer = 0;
  final messageController = TextEditingController();
  final messages = <String>[
    'Добро пожаловать в NOVA! Здесь начинается общение.',
    'Это первая сборка интерфейса. Дальше подключим аккаунты, серверы и голосовые комнаты.',
  ];

  final sections = const [
    ('#', 'general'),
    ('#', 'announcements'),
    ('◉', 'voice lounge'),
  ];

  @override
  void dispose() {
    messageController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: DecoratedBox(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [Color(0xFF171629), novaBg, Color(0xFF101820)],
          ),
        ),
        child: SafeArea(
          child: Row(
            children: [
              Container(
                width: 76,
                color: const Color(0xCC0B0C10),
                child: Column(
                  children: [
                    const SizedBox(height: 14),
                    _server('N', 0),
                    _server('🎮', 1),
                    _server('♫', 2),
                    const Spacer(),
                    _server('＋', 3),
                    const SizedBox(height: 14),
                  ],
                ),
              ),
              Container(
                width: 230,
                color: const Color(0xCC151720),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    TweenAnimationBuilder<double>(
                      tween: Tween(begin: 0, end: 1),
                      duration: const Duration(milliseconds: 850),
                      curve: Curves.easeOutBack,
                      builder: (context, value, child) => Opacity(
                        opacity: value.clamp(0, 1),
                        child: Transform.translate(
                          offset: Offset(0, 18 * (1 - value)),
                          child: child,
                        ),
                      ),
                      child: const Padding(
                        padding: EdgeInsets.all(20),
                        child: Text('NOVA  ✦',
                            style: TextStyle(fontSize: 21, fontWeight: FontWeight.w800, letterSpacing: 1.2)),
                      ),
                    ),
                    const Padding(
                      padding: EdgeInsets.fromLTRB(16, 8, 16, 10),
                      child: Text('ТЕКСТОВЫЕ КАНАЛЫ',
                          style: TextStyle(color: Colors.white54, fontSize: 11, fontWeight: FontWeight.bold)),
                    ),
                    for (var i = 0; i < sections.length; i++)
                      AnimatedContainer(
                        duration: const Duration(milliseconds: 260),
                        curve: Curves.easeOutCubic,
                        margin: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                        decoration: BoxDecoration(
                          color: selected == i ? novaAccent.withValues(alpha: .18) : Colors.transparent,
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: ListTile(
                          dense: true,
                          selected: selected == i,
                          leading: Text(sections[i].$1, style: const TextStyle(color: Colors.white54)),
                          title: Text(sections[i].$2),
                          onTap: () => setState(() => selected = i),
                        ),
                      ),
                    const Spacer(),
                    Container(
                      padding: const EdgeInsets.all(14),
                      color: const Color(0xFF101116),
                      child: const Row(
                        children: [
                          CircleAvatar(backgroundColor: novaAccent, child: Icon(Icons.person, color: Colors.white)),
                          SizedBox(width: 10),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text('Гость NOVA', style: TextStyle(fontWeight: FontWeight.w600)),
                                Text('Демо-профиль', style: TextStyle(color: Colors.white54, fontSize: 11)),
                              ],
                            ),
                          ),
                          Icon(Icons.settings, color: Colors.white54, size: 19),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              Expanded(
                child: Column(
                  children: [
                    Container(
                      height: 64,
                      padding: const EdgeInsets.symmetric(horizontal: 24),
                      decoration: const BoxDecoration(border: Border(bottom: BorderSide(color: Colors.white10))),
                      child: Row(
                        children: [
                          const Icon(Icons.tag, color: Colors.white54),
                          const SizedBox(width: 10),
                          AnimatedSwitcher(
                            duration: const Duration(milliseconds: 240),
                            transitionBuilder: (child, animation) => FadeTransition(
                              opacity: animation,
                              child: SlideTransition(
                                position: Tween<Offset>(begin: const Offset(0, .25), end: Offset.zero).animate(animation),
                                child: child,
                              ),
                            ),
                            child: Text(
                              sections[selected].$2,
                              key: ValueKey(selected),
                              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                            ),
                          ),
                          const Spacer(),
                          const Icon(Icons.notifications_none, color: Colors.white54),
                          const SizedBox(width: 18),
                          const Icon(Icons.people_outline, color: Colors.white54),
                        ],
                      ),
                    ),
                    Expanded(
                      child: AnimatedSwitcher(
                        duration: const Duration(milliseconds: 320),
                        switchInCurve: Curves.easeOutCubic,
                        switchOutCurve: Curves.easeInCubic,
                        transitionBuilder: (child, animation) => FadeTransition(
                          opacity: animation,
                          child: SlideTransition(
                            position: Tween<Offset>(begin: const Offset(.025, 0), end: Offset.zero).animate(animation),
                            child: child,
                          ),
                        ),
                        child: ListView(
                          key: ValueKey('messages-$selected'),
                          padding: const EdgeInsets.all(24),
                          children: [
                            const SizedBox(height: 24),
                            const Text('Добро пожаловать в NOVA',
                                style: TextStyle(fontSize: 28, fontWeight: FontWeight.w800)),
                            const SizedBox(height: 8),
                            const Text('Твоё пространство для общения, команд и идей.',
                                style: TextStyle(color: Colors.white60)),
                            const SizedBox(height: 30),
                            for (var i = 0; i < messages.length; i++)
                              _messageBubble(messages[i], i),
                          ],
                        ),
                      ),
                    ),
                    Padding(
                      padding: const EdgeInsets.fromLTRB(24, 8, 24, 22),
                      child: TextField(
                        controller: messageController,
                        onSubmitted: (_) => _send(),
                        decoration: InputDecoration(
                          hintText: 'Написать в #${sections[selected].$2}',
                          filled: true,
                          fillColor: novaPanel,
                          prefixIcon: const Icon(Icons.add_circle_outline),
                          suffixIcon: IconButton(
                            icon: const Icon(Icons.send, color: novaAccent),
                            onPressed: _send,
                          ),
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(14),
                            borderSide: BorderSide.none,
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _server(String label, int index) {
    final active = activeServer == index;
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: GestureDetector(
        onTap: () => setState(() => activeServer = index),
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 280),
          curve: Curves.easeOutBack,
          width: active ? 54 : 46,
          height: active ? 54 : 46,
          decoration: BoxDecoration(
            color: active ? novaAccent : const Color(0xFF242733),
            borderRadius: BorderRadius.circular(active ? 17 : 23),
            boxShadow: active
                ? [BoxShadow(color: novaAccent.withValues(alpha: .35), blurRadius: 18, spreadRadius: 1)]
                : const [],
          ),
          alignment: Alignment.center,
          child: Text(label, style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.white)),
        ),
      ),
    );
  }

  Widget _messageBubble(String message, int index) => TweenAnimationBuilder<double>(
        key: ValueKey('message-$index-$message'),
        tween: Tween(begin: 0, end: 1),
        duration: Duration(milliseconds: 420 + (index.clamp(0, 5) * 70)),
        curve: Curves.easeOutCubic,
        builder: (context, value, child) => Opacity(
          opacity: value.clamp(0, 1),
          child: Transform.translate(offset: Offset(0, 16 * (1 - value)), child: child),
        ),
        child: Padding(
          padding: const EdgeInsets.only(bottom: 18),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const CircleAvatar(backgroundColor: novaAccent, child: Icon(Icons.person, color: Colors.white)),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('NOVA Assistant  ·  сейчас', style: TextStyle(fontWeight: FontWeight.bold)),
                    const SizedBox(height: 4),
                    Text(message, style: const TextStyle(color: Colors.white70)),
                  ],
                ),
              ),
            ],
          ),
        ),
      );

  void _send() {
    final value = messageController.text.trim();
    if (value.isEmpty) return;
    setState(() {
      messages.add(value);
      messageController.clear();
    });
  }
}
