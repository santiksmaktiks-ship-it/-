import { type FormEvent, useEffect, useMemo, useState } from 'react';
import brandIcon from '../../assets/brand/icon.png';

type Page = 'home' | 'profiles' | 'settings';
const loaderLabels: Record<NivaLoader, string> = {
  vanilla: 'Vanilla', fabric: 'Fabric', forge: 'Forge', neoforge: 'NeoForge', quilt: 'Quilt',
};

export default function App() {
  const [page, setPage] = useState<Page>('home');
  const [info, setInfo] = useState<NivaAppInfo | null>(null);
  const [profiles, setProfiles] = useState<NivaProfile[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [settings, setSettings] = useState<NivaSettings>({ theme: 'dark', reduceMotion: false });
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<{ kind: 'success' | 'error' | 'info'; text: string } | null>(null);
  const activeProfile = useMemo(() => profiles.find((p) => p.id === activeId) ?? null, [profiles, activeId]);

  useEffect(() => {
    let mounted = true;
    Promise.all([window.niva.getInfo(), window.niva.listProfiles(), window.niva.getSettings()])
      .then(([appInfo, profileState, appSettings]) => {
        if (!mounted) return;
        setInfo(appInfo);
        setProfiles(profileState.profiles);
        setActiveId(profileState.activeProfileId);
        setSettings(appSettings);
        document.documentElement.dataset.theme = appSettings.theme;
        document.documentElement.dataset.reduceMotion = String(appSettings.reduceMotion);
      })
      .catch((error: unknown) => {
        if (mounted) setNotice({ kind: 'error', text: error instanceof Error ? error.message : 'Не удалось загрузить NIVA.' });
      })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  function notify(text: string, kind: 'success' | 'error' | 'info' = 'success') { setNotice({ text, kind }); }

  async function openOfficialLauncher() {
    setBusy(true);
    try {
      const result = await window.niva.openOfficialLauncher();
      notify(result.message || 'Официальный Minecraft Launcher открыт.', result.message ? 'info' : 'success');
    } catch (error) {
      notify(error instanceof Error ? error.message : 'Не удалось открыть официальный лаунчер.', 'error');
    } finally { setBusy(false); }
  }

  async function refreshProfiles() {
    const result = await window.niva.listProfiles();
    setProfiles(result.profiles);
    setActiveId(result.activeProfileId);
  }

  async function createProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const name = String(form.get('name') || '');
    const loader = String(form.get('loader') || 'vanilla') as NivaLoader;
    const gameVersion = String(form.get('gameVersion') || '');
    setBusy(true);
    try {
      await window.niva.createProfile({ name, loader, gameVersion });
      await refreshProfiles();
      formElement.reset();
      notify('Локальный профиль создан. Игровые файлы пока не устанавливались.');
    } catch (error) {
      notify(error instanceof Error ? error.message : 'Не удалось создать профиль.', 'error');
    } finally { setBusy(false); }
  }

  async function selectProfile(id: string) {
    try {
      await window.niva.activateProfile(id);
      setActiveId(id);
      notify('Активный профиль изменён.');
    } catch (error) { notify(error instanceof Error ? error.message : 'Не удалось выбрать профиль.', 'error'); }
  }

  async function deleteProfile(profile: NivaProfile) {
    const confirmed = window.confirm(`Удалить карточку профиля «${profile.name}»? Это удалит только запись NIVA, не миры и не файлы Minecraft.`);
    if (!confirmed) return;
    try {
      await window.niva.deleteProfile(profile.id);
      await refreshProfiles();
      notify('Карточка профиля удалена. Файлы Minecraft не затронуты.');
    } catch (error) { notify(error instanceof Error ? error.message : 'Не удалось удалить профиль.', 'error'); }
  }

  async function changeSettings(patch: Partial<NivaSettings>) {
    try {
      const updated = await window.niva.updateSettings(patch);
      setSettings(updated);
      document.documentElement.dataset.theme = updated.theme;
      document.documentElement.dataset.reduceMotion = String(updated.reduceMotion);
      notify('Настройки сохранены.');
    } catch (error) { notify(error instanceof Error ? error.message : 'Не удалось сохранить настройки.', 'error'); }
  }

  async function openDataFolder() {
    try { await window.niva.openDataFolder(); notify('Папка данных NIVA открыта.'); }
    catch (error) { notify(error instanceof Error ? error.message : 'Не удалось открыть папку данных.', 'error'); }
  }

  if (loading) return <div className="boot"><img src={brandIcon} alt="NIVA" /><span>Запускаем NIVA</span></div>;

  return <div className="shell">
    <aside className="sidebar">
      <div className="brand"><img src={brandIcon} alt="" /><div><b>NIVA</b><small>LAUNCHER</small></div></div>
      <div className="side-label">РАБОЧЕЕ ПРОСТРАНСТВО</div>
      <nav aria-label="Основная навигация">
        <button className={page === 'home' ? 'nav active' : 'nav'} onClick={() => setPage('home')}><span>⌂</span>Главная</button>
        <button className={page === 'profiles' ? 'nav active' : 'nav'} onClick={() => setPage('profiles')}><span>▦</span>Профили <i>{profiles.length}</i></button>
      </nav>
      <div className="side-bottom">
        <button className={page === 'settings' ? 'nav active' : 'nav'} onClick={() => setPage('settings')}><span>⚙</span>Настройки</button>
        <small className="version"><i /> Версия {info?.version ?? '0.1.0'}</small>
      </div>
    </aside>

    <main>
      <header className="topbar">
        <div className="crumb"><b>NIVA</b><span>/</span>{page === 'home' ? 'Главная' : page === 'profiles' ? 'Профили' : 'Настройки'}</div>
        <div className="top-right"><span className="local"><i /> Локальный режим</span><div className="avatar">N</div></div>
      </header>

      <div className="content">
        {page === 'home' && <>
          <section className="hero">
            <div>
              <div className="eyebrow"><i /> CONTROL CENTER</div>
              <h1>Твой мир.<br /><em>Твои правила.</em></h1>
              <p className="lead">NIVA собирает игровые профили и настройки в одном спокойном пространстве.</p>
              <div className="actions">
                <button className="primary" disabled={busy} onClick={openOfficialLauncher}><span>▶</span>{busy ? 'Открываем…' : 'Открыть Minecraft Launcher'}</button>
                <button className="link-button" onClick={() => setPage('profiles')}>Мои профили <b>↗</b></button>
              </div>
            </div>
            <div className="hero-art"><div className="ring ring-a" /><div className="ring ring-b" /><img src={brandIcon} alt="" /><small>N / 001</small></div>
          </section>

          <section className="section">
            <div className="section-head"><div><div className="eyebrow small">YOUR SETUPS</div><h2>Твои профили</h2></div><button className="quiet" onClick={() => setPage('profiles')}>Все профили <b>→</b></button></div>
            {profiles.length === 0 ? <div className="empty">
              <div className="empty-icon">＋</div><div><b>Пока здесь пусто</b><p>Создай первую карточку профиля, чтобы сохранить версию и тип загрузчика.</p></div>
              <button className="outline" onClick={() => setPage('profiles')}>Создать профиль</button>
            </div> : <div className="cards">
              {profiles.slice(0, 3).map((profile) => <ProfileCard key={profile.id} profile={profile} active={profile.id === activeId} onSelect={() => void selectProfile(profile.id)} />)}
            </div>}
          </section>

          <div className="notice"><span>i</span><div><b>Без отдельной авторизации в NIVA</b><p>NIVA не запрашивает пароль и не хранит игровые токены. Для входа и самой игры используется установленный официальный Minecraft Launcher.</p></div></div>
        </>}

        {page === 'profiles' && <>
          <div className="title-row"><div><div className="eyebrow"><i /> YOUR LIBRARY</div><h1 className="page-title">Профили</h1><p className="description">Локальные карточки конфигураций NIVA. Пока они не устанавливают Minecraft или моды.</p></div><div className="count"><b>{String(profiles.length).padStart(2, '0')}</b><small>СОХРАНЕНО</small></div></div>
          <div className="profiles-layout">
            <section className="panel"><div className="panel-head"><div className="eyebrow small">SAVED SETUPS</div><h2>Сохранённые профили</h2></div>
              {profiles.length === 0 ? <div className="empty-list"><span>▦</span><b>Нет профилей</b><small>Создай первый справа.</small></div> : profiles.map((profile) => <ProfileRow key={profile.id} profile={profile} active={profile.id === activeId} onSelect={() => void selectProfile(profile.id)} onDelete={() => void deleteProfile(profile)} />)}
            </section>
            <section className="panel"><div className="panel-head"><div className="eyebrow small">NEW CONFIGURATION</div><h2>Новый профиль</h2></div>
              <form className="form" onSubmit={createProfile}>
                <label>Название профиля<input name="name" maxLength={32} placeholder="Например, Survival 1.21" required /></label>
                <label>Загрузчик<select name="loader" defaultValue="vanilla"><option value="vanilla">Vanilla</option><option value="fabric">Fabric</option><option value="forge">Forge</option><option value="neoforge">NeoForge</option><option value="quilt">Quilt</option></select></label>
                <label>Версия Minecraft<input name="gameVersion" maxLength={32} defaultValue="latest" required /></label>
                <button className="primary full" type="submit" disabled={busy}>＋ Сохранить профиль</button>
                <small className="hint">Сохраняются только метаданные. Игровые файлы не изменяются.</small>
              </form>
            </section>
          </div>
        </>}

        {page === 'settings' && <>
          <div className="title-row"><div><div className="eyebrow"><i /> PREFERENCES</div><h1 className="page-title">Настройки</h1><p className="description">Внешний вид и локальные данные приложения.</p></div></div>
          <section className="panel settings">
            <div className="setting"><div><b>Тема интерфейса</b><p>Выбери оформление NIVA.</p></div><div className="segments"><button className={settings.theme === 'dark' ? 'selected' : ''} onClick={() => void changeSettings({ theme: 'dark' })}>Тёмная</button><button className={settings.theme === 'light' ? 'selected' : ''} onClick={() => void changeSettings({ theme: 'light' })}>Светлая</button></div></div>
            <div className="setting"><div><b>Уменьшить анимацию</b><p>Отключает декоративные движения интерфейса.</p></div><button className={settings.reduceMotion ? 'toggle on' : 'toggle'} role="switch" aria-checked={settings.reduceMotion} onClick={() => void changeSettings({ reduceMotion: !settings.reduceMotion })}><span /></button></div>
            <div className="setting"><div><b>Папка данных NIVA</b><p>Настройки и сохранённые карточки профилей.</p><code>{info?.userDataPath || 'Путь недоступен'}</code></div><button className="outline" onClick={() => void openDataFolder()}>Открыть папку</button></div>
            <div className="setting"><div><b>Информация о приложении</b><p>NIVA Launcher · {info?.version || '0.1.0'} · {info?.platform || 'unknown'}</p><small>{info?.packaged ? 'Установленная сборка' : 'Режим разработки'}</small></div><span className="mark">NIVA / 001</span></div>
          </section>
        </>}
      </div>

      <footer><span>© NIVA LAUNCHER</span><span>Сделано для спокойного старта <b>✳</b></span></footer>
    </main>
    {notice && <div className={`toast ${notice.kind}`} role="status"><span>{notice.kind === 'error' ? '!' : notice.kind === 'info' ? 'i' : '✓'}</span>{notice.text}<button aria-label="Закрыть уведомление" onClick={() => setNotice(null)}>×</button></div>}
    <span className="sr-only">{activeProfile ? `Активный профиль: ${activeProfile.name}` : 'Активный профиль не выбран'}</span>
  </div>;
}

function ProfileCard({ profile, active, onSelect }: { profile: NivaProfile; active: boolean; onSelect: () => void }) {
  return <button className={active ? 'profile-card current' : 'profile-card'} onClick={onSelect}>
    <span className="card-top"><span className="glyph">{profile.loader === 'vanilla' ? 'V' : profile.loader[0].toUpperCase()}</span>{active ? <span className="tag">АКТИВЕН</span> : <span>↗</span>}</span>
    <b>{profile.name}</b><small>{loaderLabels[profile.loader]} · Minecraft {profile.gameVersion}</small>
  </button>;
}

function ProfileRow({ profile, active, onSelect, onDelete }: { profile: NivaProfile; active: boolean; onSelect: () => void; onDelete: () => void }) {
  return <div className="profile-row"><button className="row-main" onClick={onSelect}><span className="glyph">{profile.loader === 'vanilla' ? 'V' : profile.loader[0].toUpperCase()}</span><span><b>{profile.name}</b><small>{loaderLabels[profile.loader]} · Minecraft {profile.gameVersion}</small></span>{active && <span className="tag">АКТИВЕН</span>}</button><button className="delete" onClick={onDelete} aria-label={`Удалить профиль ${profile.name}`}>×</button></div>;
}
