'use strict';

class RandomNotePlugin {
  constructor(app, manifest) {
    this.app = app;
    this.manifest = manifest;
    this._handles = [];
  }

  async onload() {
    const openRandom = async () => {
      const notes = await this.app.notes.list();
      if (notes.length === 0) {
        this.app.ui.showNotice('目前沒有筆記', { type: 'info' });
        return;
      }
      const pick = notes[Math.floor(Math.random() * notes.length)];
      this.app.workspace.openNote(pick.id);
      this.app.ui.showNotice('已開啟：' + (pick.title || pick.id), { type: 'success' });
    };

    this._handles.push(
      this.app.ui.addCommand({
        id: 'open',
        label: '開啟隨機筆記',
        keywords: ['random', '隨機', 'shuffle'],
        section: 'Plugin',
        icon: 'Shuffle',
        run: openRandom,
      }),
    );

    this._handles.push(
      this.app.ui.addSidebarItem({
        id: 'open',
        label: '隨機筆記',
        icon: 'shuffle',
        order: 10,
        onClick: () => {
          void openRandom();
        },
      }),
    );
  }

  async onunload() {
    for (const h of this._handles) {
      try {
        h.dispose();
      } catch (e) {
        void e;
      }
    }
    this._handles = [];
  }
}

module.exports = RandomNotePlugin;
