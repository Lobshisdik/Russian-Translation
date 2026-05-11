import sys
import os
import json
import shutil
import re
from datetime import datetime
from PyQt6.QtWidgets import (QApplication, QMainWindow, QWidget, QVBoxLayout, QHBoxLayout, 
                             QLineEdit, QPushButton, QComboBox, QTableView, QHeaderView, 
                             QLabel, QFileDialog, QMessageBox, QFrame, QAbstractButton,
                             QScrollArea, QListWidget, QListWidgetItem, QSizePolicy, QStyledItemDelegate, QCheckBox,
                             QDialog, QTabWidget)
from PyQt6.QtCore import Qt, QAbstractTableModel, QModelIndex, pyqtSignal, QSortFilterProxyModel, QRect, QTimer
from PyQt6.QtGui import QColor, QPalette, QFont, QIcon, QPainter, QLinearGradient, QPen

class ModernTheme:
    # Night Mode (Dark)
    DARK_BG = "#0a0a0c"
    DARK_CARD = "#1a1a1e"
    DARK_TEXT = "#e2e8f0"
    DARK_MUTED = "#64748b"
    DARK_BORDER = "rgba(255, 255, 255, 0.08)"
    DARK_ACCENT = "#DAA520" # Goldenrod
    DARK_ACCENT_ALT = "#B8860B" # DarkGoldenrod
    
    # Day Mode (Light)
    LIGHT_BG = "#ffffff"
    LIGHT_CARD = "#f1f5f9"
    LIGHT_TEXT = "#0f172a"
    LIGHT_MUTED = "#94a3b8"
    LIGHT_BORDER = "rgba(15, 23, 42, 0.1)"
    LIGHT_ACCENT = "#2563eb" # Royal Blue
    LIGHT_ACCENT_ALT = "#1d4ed8" # Darker Blue
    
    SUCCESS = "#10b981"
    DANGER = "#f43f5e"

    @staticmethod
    def get_accent(is_night=True):
        return ModernTheme.DARK_ACCENT if is_night else ModernTheme.LIGHT_ACCENT

    @staticmethod
    def get_qss(is_night=True):
        bg = ModernTheme.DARK_BG if is_night else ModernTheme.LIGHT_BG
        card = ModernTheme.DARK_CARD if is_night else ModernTheme.LIGHT_CARD
        text = ModernTheme.DARK_TEXT if is_night else ModernTheme.LIGHT_TEXT
        muted = ModernTheme.DARK_MUTED if is_night else ModernTheme.LIGHT_MUTED
        border = ModernTheme.DARK_BORDER if is_night else ModernTheme.LIGHT_BORDER
        accent = ModernTheme.DARK_ACCENT if is_night else ModernTheme.LIGHT_ACCENT
        accent_alt = ModernTheme.DARK_ACCENT_ALT if is_night else ModernTheme.LIGHT_ACCENT_ALT
        
        alt_bg = "#0d0d10" if is_night else "#f8fafc"
        sidebar_bg = "#0f0f12" if is_night else "#f1f5f9"
        header_bg = "#0f0f12" if is_night else "#ffffff"

        return f"""
        QMainWindow {{
            background-color: {bg};
        }}
        QWidget {{
            color: {text};
            font-family: 'Segoe UI', 'Inter', sans-serif;
            font-size: 13px;
        }}
        QFrame#Sidebar {{
            background-color: {sidebar_bg};
            border-right: 1px solid {border};
        }}
        QFrame#Content {{
            background-color: {bg};
        }}
        QLineEdit {{
            background-color: {card};
            border: 1px solid {border};
            border-radius: 6px;
            padding: 8px 12px;
            color: {text};
        }}
        QLineEdit:focus {{
            border: 1px solid {accent};
        }}
        QPushButton {{
            background-color: {card};
            border: 1px solid {border};
            border-radius: 6px;
            padding: 8px 16px;
            font-weight: bold;
            color: {text};
        }}
        QPushButton:hover {{
            background-color: {"#252529" if is_night else "#e2e8f0"};
            border: 1px solid {accent};
        }}
        QPushButton#PrimaryButton {{
            background: qlineargradient(x1:0, y1:0, x2:1, y2:1, stop:0 {accent}, stop:1 {accent_alt});
            border: none;
            color: {"black" if is_night else "white"};
        }}
        QPushButton#PrimaryButton:hover {{
            background: qlineargradient(x1:0, y1:0, x2:1, y2:1, stop:0 {"#FFD700" if is_night else "#3b82f6"}, stop:1 {accent});
        }}
        QComboBox {{
            background-color: {card};
            border: 1px solid {border};
            border-radius: 6px;
            padding: 4px 8px;
            color: {text};
        }}
        QTableView {{
            background-color: transparent;
            border: none;
            gridline-color: {border};
            selection-background-color: {"rgba(218, 165, 32, 0.15)" if is_night else "rgba(37, 99, 235, 0.1)"};
            selection-color: {text};
            alternate-background-color: {alt_bg};
        }}
        QHeaderView::section {{
            background-color: {header_bg};
            color: {muted};
            padding: 8px;
            border: none;
            border-bottom: 1px solid {border};
            font-weight: bold;
            font-size: 11px;
            text-transform: uppercase;
        }}
        QListWidget {{
            background-color: transparent;
            border: none;
            outline: none;
        }}
        QListWidget::item {{
            padding: 8px 12px;
            border-radius: 4px;
            margin-bottom: 2px;
            color: {text};
            font-size: 13px;
        }}
        QListWidget::item:selected {{
            background-color: {"rgba(218, 165, 32, 0.2)" if is_night else "rgba(37, 99, 235, 0.15)"};
            color: {accent};
            font-weight: bold;
        }}
        QScrollBar:vertical {{
            border: none;
            background: transparent;
            width: 10px;
        }}
        QScrollBar::handle:vertical {{
            background: {"#333" if is_night else "#cbd5e1"};
            min-height: 20px;
            border-radius: 5px;
        }}
        QScrollBar::add-line:vertical, QScrollBar::sub-line:vertical {{
            border: none;
            background: none;
        }}
        QLabel#HeaderTitle {{
            font-size: 18px;
            font-weight: 900;
            color: {accent};
        }}
        """

class ModernSwitch(QAbstractButton):
    def __init__(self, parent=None, track_radius=12, thumb_radius=10):
        super().__init__(parent)
        self.setCheckable(True)
        self.setSizePolicy(QSizePolicy.Policy.Fixed, QSizePolicy.Policy.Fixed)
        self._track_radius = track_radius
        self._thumb_radius = thumb_radius
        self._margin = (track_radius - thumb_radius)
        self.setFixedSize(track_radius * 4, track_radius * 2)

    def paintEvent(self, event):
        painter = QPainter(self)
        painter.setRenderHint(QPainter.RenderHint.Antialiasing)
        
        # Track
        is_night = self.isChecked()
        track_color = QColor(ModernTheme.get_accent(is_night)) if is_night else QColor("#cbd5e1")
        painter.setBrush(track_color)
        painter.setPen(Qt.PenStyle.NoPen)
        painter.drawRoundedRect(0, 0, self.width(), self.height(), self._track_radius, self._track_radius)
        
        # Thumb
        thumb_color = QColor("white")
        painter.setBrush(thumb_color)
        x_pos = (self.width() - self._thumb_radius * 2 - self._margin) if self.isChecked() else self._margin
        painter.drawEllipse(int(x_pos), self._margin, self._thumb_radius * 2, self._thumb_radius * 2)

class GroupSeparatorDelegate(QStyledItemDelegate):
    def paint(self, painter, option, index):
        super().paint(painter, option, index)
        
        # Check if this row is the end of a multi-row group
        model = index.model()
        if isinstance(model, QSortFilterProxyModel):
            source_index = model.mapToSource(index)
            source_model = model.sourceModel()
        else:
            source_index = index
            source_model = model
            
        if source_index.row() >= len(source_model._data):
            return

        row_data = source_model._data[source_index.row()]
        # row_data: [key, ref, target, cat, is_last_in_group, group_size]
        if len(row_data) > 4 and row_data[4] and row_data[5] > 1:
            painter.save()
            is_night = source_model.is_night if hasattr(source_model, "is_night") else True
            color = QColor("white") if is_night else QColor("#cbd5e1")
            pen = QPen(color, 1)
            painter.setPen(pen)
            rect = option.rect
            painter.drawLine(rect.bottomLeft(), rect.bottomRight())
            painter.restore()

def flatten_json(obj, prefix=''):
    result = {}
    if isinstance(obj, dict):
        items = obj.items()
    elif isinstance(obj, list):
        items = enumerate(obj)
    else:
        # Base case: value is a string or other primitive
        return {prefix[:-1]: str(obj)} if prefix.endswith('.') else {prefix: str(obj)}

    for key, value in items:
        if isinstance(value, (dict, list)):
            result.update(flatten_json(value, f"{prefix}{key}."))
        else:
            result[f"{prefix}{key}"] = str(value) if value is not None else ""
    return result

def unflatten_json(data):
    result = {}
    for full_key, value in data.items():
        parts = full_key.split('.')
        current = result
        for i, part in enumerate(parts[:-1]):
            if part not in current:
                current[part] = {}
            current = current[part]
        current[parts[-1]] = value
    
    # Post-process to convert numeric-keyed dicts back to lists
    def convert_to_lists(obj):
        if not isinstance(obj, dict):
            return obj
        
        # First, recursively convert children
        for k in list(obj.keys()):
            obj[k] = convert_to_lists(obj[k])
            
        # Check if this dict should be a list
        keys = list(obj.keys())
        if not keys: return obj
        
        # If all keys are numeric, check if they form a sequence 0..N-1
        if all(k.isdigit() for k in keys):
            indices = sorted([int(k) for k in keys])
            if indices == list(range(len(indices))):
                return [obj[str(i)] for i in indices]
        return obj

    return convert_to_lists(result)

def natural_sort_key(s):
    return [int(text) if text.isdigit() else text.lower()
            for text in re.split('([0-9]+)', str(s))]

def i18n_key_sorter(key):
    if '.' not in key:
        return (natural_sort_key(key), 0, "")
    
    parts = key.rsplit('.', 1)
    prefix = parts[0]
    suffix = parts[1].lower()
    
    # Priority: 0 for name, 1 for desc/description, 2 for others
    priority = 2
    if 'name' in suffix:
        priority = 0
    elif 'description' in suffix or 'desc' in suffix:
        priority = 1
        
    return (natural_sort_key(prefix), priority, natural_sort_key(suffix))

class CustomSortFilterProxyModel(QSortFilterProxyModel):
    def __init__(self, parent=None):
        super().__init__(parent)
        self.show_missing_only = False
        self.search_text = ""

    def filterAcceptsRow(self, source_row, source_parent):
        model = self.sourceModel()
        key = str(model._data[source_row][0]).lower()
        ref = str(model._data[source_row][1]).lower()
        target = str(model._data[source_row][2]).lower()
        
        # 1. Missing Only filter
        if self.show_missing_only and target.strip():
            return False
            
        # 2. Search Text filter (across all 3 columns)
        if self.search_text:
            st = self.search_text.lower()
            if st not in key and st not in ref and st not in target:
                return False
                
        return True

class RevisionsDialog(QDialog):
    def __init__(self, i18n_path, current_lang, parent=None):
        super().__init__(parent)
        self.i18n_path = i18n_path
        self.current_lang = current_lang
        self.setWindowTitle(f"Revisions - {current_lang.upper()}")
        self.resize(700, 500)
        self.init_ui()

    def init_ui(self):
        layout = QVBoxLayout(self)
        
        header = QLabel(f"Snapshots and Autosaves for {self.current_lang}")
        header.setStyleSheet("font-size: 16px; font-weight: bold; margin-bottom: 10px;")
        layout.addWidget(header)
        
        tables_layout = QHBoxLayout()
        
        # Snapshots Table
        self.snap_list = QListWidget()
        snap_box = QVBoxLayout()
        snap_box.addWidget(QLabel("MANUAL SNAPSHOTS (Max 20)"))
        snap_box.addWidget(self.snap_list)
        tables_layout.addLayout(snap_box)
        
        # Autosaves Table
        self.auto_list = QListWidget()
        auto_box = QVBoxLayout()
        auto_box.addWidget(QLabel("AUTOSAVES (Max 10)"))
        auto_box.addWidget(self.auto_list)
        tables_layout.addLayout(auto_box)
        
        layout.addLayout(tables_layout)
        
        self.refresh_lists()
        
        btn_layout = QHBoxLayout()
        self.restore_btn = QPushButton("Restore Selected")
        self.restore_btn.clicked.connect(self.restore_selected)
        btn_layout.addStretch()
        btn_layout.addWidget(self.restore_btn)
        layout.addLayout(btn_layout)

    def refresh_lists(self):
        self.snap_list.clear()
        self.auto_list.clear()
        
        backup_root = os.path.join(os.path.dirname(self.i18n_path), ".i18n_backups")
        
        # Load Snapshots
        snap_path = os.path.join(backup_root, "snapshots", self.current_lang)
        if os.path.exists(snap_path):
            dirs = sorted(os.listdir(snap_path), reverse=True)
            for d in dirs:
                item = QListWidgetItem(d.replace('_', ' '))
                item.setData(Qt.ItemDataRole.UserRole, os.path.join(snap_path, d))
                self.snap_list.addItem(item)
                
        # Load Autosaves
        auto_path = os.path.join(backup_root, "autosaves", self.current_lang)
        if os.path.exists(auto_path):
            dirs = sorted(os.listdir(auto_path), reverse=True)
            for d in dirs:
                item = QListWidgetItem(d.replace('_', ' '))
                item.setData(Qt.ItemDataRole.UserRole, os.path.join(auto_path, d))
                self.auto_list.addItem(item)

    def restore_selected(self):
        selected_snap = self.snap_list.selectedItems()
        selected_auto = self.auto_list.selectedItems()
        
        if not selected_snap and not selected_auto:
            QMessageBox.warning(self, "Warning", "Please select a revision to restore.")
            return
            
        item = selected_snap[0] if selected_snap else selected_auto[0]
        backup_path = item.data(Qt.ItemDataRole.UserRole)
        
        confirm = QMessageBox.question(self, "Confirm Restore", 
                                     f"Are you sure you want to restore from {item.text()}?\n"
                                     "This will overwrite your current translation files for this language.",
                                     QMessageBox.StandardButton.Yes | QMessageBox.StandardButton.No)
        
        if confirm == QMessageBox.StandardButton.Yes:
            target_path = os.path.join(self.i18n_path, self.current_lang)
            try:
                # Backup current to a temp before overwriting?
                shutil.rmtree(target_path, ignore_errors=True)
                shutil.copytree(backup_path, target_path)
                QMessageBox.information(self, "Success", "Language restored successfully. Please reload the category.")
                self.accept()
            except Exception as e:
                QMessageBox.critical(self, "Error", f"Failed to restore: {str(e)}")

class PRDialog(QDialog):
    def __init__(self, lang, parent=None):
        super().__init__(parent)
        self.setWindowTitle(f"Submit PR - {lang.upper()}")
        self.resize(400, 300)
        layout = QVBoxLayout(self)
        
        layout.addWidget(QLabel("PR Title:"))
        self.title_input = QLineEdit(f"Update {lang.upper()} translations")
        layout.addWidget(self.title_input)
        
        layout.addWidget(QLabel("PR Description:"))
        self.body_input = QListWidget() # Actually should be QTextEdit
        from PyQt6.QtWidgets import QTextEdit
        self.body_input = QTextEdit()
        self.body_input.setPlaceholderText("Describe your changes...")
        layout.addWidget(self.body_input)
        
        self.btn = QPushButton("Create Pull Request")
        self.btn.clicked.connect(self.accept)
        layout.addWidget(self.btn)

class TranslationModel(QAbstractTableModel):
    def __init__(self, data=None):
        super().__init__()
        self._data = data or [] # List of [key, ref_val, target_val, file]
        self.headers = ["Key", "Reference", "Translation"]
        self.is_night = True

    def rowCount(self, parent=QModelIndex()):
        return len(self._data)

    def columnCount(self, parent=QModelIndex()):
        return 3

    def data(self, index, role=Qt.ItemDataRole.DisplayRole):
        if not index.isValid():
            return None
        
        row = index.row()
        col = index.column()

        if role == Qt.ItemDataRole.DisplayRole or role == Qt.ItemDataRole.EditRole:
            return self._data[row][col]
        
        if role == Qt.ItemDataRole.ForegroundRole:
            if col == 0: return QColor(ModernTheme.get_accent(self.is_night))
        
        return None

    def setData(self, index, value, role=Qt.ItemDataRole.EditRole):
        if index.isValid() and role == Qt.ItemDataRole.EditRole:
            self._data[index.row()][index.column()] = value
            self.dataChanged.emit(index, index, [role])
            return True
        return False

    def flags(self, index):
        if not index.isValid():
            return Qt.ItemFlag.NoItemFlags
        if index.column() == 2:
            return Qt.ItemFlag.ItemIsEnabled | Qt.ItemFlag.ItemIsSelectable | Qt.ItemFlag.ItemIsEditable
        return Qt.ItemFlag.ItemIsEnabled | Qt.ItemFlag.ItemIsSelectable

    def headerData(self, section, orientation, role):
        if role == Qt.ItemDataRole.DisplayRole and orientation == Qt.Orientation.Horizontal:
            return self.headers[section]
        return None

class I18nExplorer(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("i18n Translator Pro")
        self.resize(1280, 800)
        self.is_night = True
        self.setStyleSheet(ModernTheme.get_qss(self.is_night))

        self.i18n_path = self.find_i18n_path()
        
        self.languages = []
        self.categories = []
        self.current_data = [] # Full flattened data
        self.warning_dismissed = False
        
        self.init_ui()
        
        # Autosave Timer
        self.autosave_timer = QTimer(self)
        self.autosave_timer.setInterval(300000) # 5 minutes
        self.autosave_timer.timeout.connect(lambda: self.create_backup(is_manual=False))
        self.autosave_timer.start()
        if self.i18n_path:
            self.path_label.setText(self.i18n_path)
            self.refresh_languages()
        
    def find_i18n_path(self):
        # 1. Check relative to script location (common case: script is in /tools/)
        script_dir = os.path.dirname(os.path.abspath(__file__))
        potential_paths = [
            os.path.join(script_dir, '..', 'js', 'plugins', 'i18n'), # Up one, then down
            os.path.join(script_dir, 'js', 'plugins', 'i18n'),      # Direct child
            os.path.join(os.getcwd(), 'js', 'plugins', 'i18n'),     # Relative to CWD
        ]
        
        # 2. Walk up from script dir to find project root
        curr = script_dir
        while curr and curr != os.path.dirname(curr):
            p = os.path.join(curr, 'js', 'plugins', 'i18n')
            if os.path.exists(p):
                return os.path.abspath(p)
            curr = os.path.dirname(curr)
            
        # 3. Check potential paths
        for p in potential_paths:
            if os.path.exists(p):
                return os.path.abspath(p)
                
        return None

    def init_ui(self):
        central_widget = QWidget()
        self.setCentralWidget(central_widget)
        main_layout = QHBoxLayout(central_widget)
        main_layout.setContentsMargins(0, 0, 0, 0)
        main_layout.setSpacing(0)

        # Sidebar
        sidebar = QFrame()
        sidebar.setObjectName("Sidebar")
        sidebar.setFixedWidth(280)
        sidebar_layout = QVBoxLayout(sidebar)
        sidebar_layout.setContentsMargins(20, 20, 20, 20)
        
        sidebar_layout.addWidget(QLabel("PROJECT FOLDER"))
        self.path_label = QLabel("Not found")
        self.path_label.setWordWrap(True)
        self.path_label.setStyleSheet(f"color: {ModernTheme.DARK_MUTED}; font-size: 10px;")
        sidebar_layout.addWidget(self.path_label)
        
        self.change_folder_btn = QPushButton("Change Folder...")
        self.change_folder_btn.setStyleSheet("font-size: 10px; padding: 4px;")
        self.change_folder_btn.clicked.connect(self.browse_i18n_folder)
        sidebar_layout.addWidget(self.change_folder_btn)
        
        sidebar_layout.addSpacing(20)
        sidebar_layout.addWidget(QLabel("REFERENCE"))
        self.ref_lang_combo = QComboBox()
        self.ref_lang_combo.currentIndexChanged.connect(self.on_lang_change)
        sidebar_layout.addWidget(self.ref_lang_combo)
        
        sidebar_layout.addSpacing(10)
        sidebar_layout.addWidget(QLabel("TARGET"))
        self.target_lang_combo = QComboBox()
        self.target_lang_combo.currentIndexChanged.connect(self.on_lang_change)
        sidebar_layout.addWidget(self.target_lang_combo)
        
        sidebar_layout.addSpacing(20)
        sidebar_layout.addWidget(QLabel("CATEGORIES"))
        self.category_list = QListWidget()
        self.category_list.itemSelectionChanged.connect(self.load_selected_category)
        sidebar_layout.addWidget(self.category_list)
        
        sidebar_layout.addSpacing(10)
        
        self.new_lang_btn = QPushButton("New Language")
        self.new_lang_btn.clicked.connect(self.create_new_language)
        sidebar_layout.addWidget(self.new_lang_btn)
        
        self.revisions_btn = QPushButton("Revisions")
        self.revisions_btn.clicked.connect(self.open_revisions)
        sidebar_layout.addWidget(self.revisions_btn)
        
        self.pr_btn = QPushButton("Submit Pull Request")
        self.pr_btn.clicked.connect(self.submit_pull_request)
        sidebar_layout.addWidget(self.pr_btn)
        
        self.save_btn = QPushButton("Save All Changes")
        self.save_btn.setObjectName("PrimaryButton")
        self.save_btn.clicked.connect(self.save_changes)
        sidebar_layout.addWidget(self.save_btn)

        # Content Area
        content = QFrame()
        content.setObjectName("Content")
        content_layout = QVBoxLayout(content)
        content_layout.setContentsMargins(0, 0, 0, 0)
        content_layout.setSpacing(0)
        
        # Header / Search
        header = QFrame()
        header.setFixedHeight(80)
        header.setStyleSheet(f"border-bottom: 1px solid {ModernTheme.DARK_BORDER};")
        header_layout = QHBoxLayout(header)
        header_layout.setContentsMargins(30, 0, 30, 0)
        
        self.search_input = QLineEdit()
        self.search_input.setPlaceholderText("Search keys, reference, or translations...")
        self.search_input.textChanged.connect(self.filter_data)
        header_layout.addWidget(self.search_input)
        
        header_layout.addSpacing(20)

        self.theme_label = QLabel("NIGHT")
        self.theme_label.setStyleSheet("font-weight: bold; font-size: 10px;")
        header_layout.addWidget(self.theme_label)

        self.theme_switch = ModernSwitch()
        self.theme_switch.setChecked(True)
        self.theme_switch.clicked.connect(self.toggle_theme)
        header_layout.addWidget(self.theme_switch)

        self.stats_label = QLabel("0 keys total")
        self.stats_label.setStyleSheet(f"color: {ModernTheme.DARK_TEXT if self.is_night else ModernTheme.LIGHT_TEXT}; opacity: 0.6;")
        header_layout.addWidget(self.stats_label)
        
        header_layout.addSpacing(20)
        self.missing_filter = QCheckBox("Missing Only")
        self.missing_filter.stateChanged.connect(self.filter_data)
        header_layout.addWidget(self.missing_filter)
        
        content_layout.addWidget(header)

        # Warning Banner
        self.warning_banner = QFrame()
        self.warning_banner.setFixedHeight(40)
        self.warning_banner.setStyleSheet(f"background-color: {ModernTheme.DANGER};")
        warning_layout = QHBoxLayout(self.warning_banner)
        warning_layout.setContentsMargins(20, 0, 20, 0)
        
        warning_text = QLabel("⚠️ This file needs to be reworked, do not edit it")
        warning_text.setStyleSheet("color: white; font-weight: bold;")
        warning_layout.addWidget(warning_text)
        
        warning_layout.addStretch()
        
        dismiss_btn = QPushButton("DISMISS")
        dismiss_btn.setFixedWidth(80)
        dismiss_btn.setStyleSheet("""
            QPushButton { 
                background: rgba(255, 255, 255, 0.2); 
                border: 1px solid white; 
                color: white; 
                font-size: 10px;
                padding: 2px;
            }
            QPushButton:hover { background: rgba(255, 255, 255, 0.4); }
        """)
        dismiss_btn.clicked.connect(self.dismiss_warning)
        warning_layout.addWidget(dismiss_btn)
        
        self.warning_banner.setVisible(False)
        content_layout.addWidget(self.warning_banner)
        
        # Table
        self.table_view = QTableView()
        self.model = TranslationModel()
        self.proxy_model = CustomSortFilterProxyModel()
        self.proxy_model.setSourceModel(self.model)
        self.proxy_model.setFilterCaseSensitivity(Qt.CaseSensitivity.CaseInsensitive)
        self.proxy_model.setFilterKeyColumn(-1) # Filter all columns
        
        self.table_view.setModel(self.proxy_model)
        self.table_view.setSortingEnabled(True)
        self.table_view.horizontalHeader().setSectionResizeMode(QHeaderView.ResizeMode.Stretch)
        self.table_view.horizontalHeader().setSectionResizeMode(0, QHeaderView.ResizeMode.Interactive)
        self.table_view.setColumnWidth(0, 300)
        self.table_view.verticalHeader().setVisible(False)
        self.table_view.setAlternatingRowColors(True)
        self.table_view.setStyleSheet("QTableView { alternate-background-color: #0d0d10; }")
        
        self.table_view.setItemDelegate(GroupSeparatorDelegate(self.table_view))
        
        content_layout.addWidget(self.table_view)

        main_layout.addWidget(sidebar)
        main_layout.addWidget(content)

    def dismiss_warning(self):
        self.warning_dismissed = True
        self.warning_banner.setVisible(False)

    def toggle_theme(self):
        self.is_night = self.theme_switch.isChecked()
        self.setStyleSheet(ModernTheme.get_qss(self.is_night))
        self.theme_label.setText("NIGHT" if self.is_night else "DAY")
        self.model.is_night = self.is_night
        self.model.layoutChanged.emit()
        self.load_selected_category() 

    def browse_i18n_folder(self):
        dir_path = QFileDialog.getExistingDirectory(self, "Select i18n Folder")
        if dir_path:
            self.i18n_path = dir_path
            self.path_label.setText(self.i18n_path)
            self.refresh_languages()

    def refresh_languages(self):
        if not self.i18n_path or not os.path.exists(self.i18n_path):
            self.path_label.setText("INVALID PATH")
            return
        
        self.languages = [d for d in os.listdir(self.i18n_path) if os.path.isdir(os.path.join(self.i18n_path, d))]
        self.ref_lang_combo.clear()
        self.target_lang_combo.clear()
        self.ref_lang_combo.addItems(self.languages)
        self.target_lang_combo.addItems(self.languages)
        
        # Default selection
        if 'en' in self.languages:
            self.ref_lang_combo.setCurrentText('en')
        if 'it' in self.languages:
            self.target_lang_combo.setCurrentText('it')
            
        self.refresh_categories()

    def refresh_categories(self):
        lang = self.target_lang_combo.currentText() if self.target_lang_combo.currentText() else self.ref_lang_combo.currentText()
        if not lang: return
        
        lang_path = os.path.join(self.i18n_path, lang)
        if not os.path.exists(lang_path): return
        
        self.categories = sorted([f[:-5] for f in os.listdir(lang_path) if f.endswith('.json')])
        self.category_list.clear()
        
        all_item = QListWidgetItem("ALL CATEGORIES")
        all_item.setData(Qt.ItemDataRole.UserRole, "all")
        self.category_list.addItem(all_item)
        
        for cat in self.categories:
            stats = self.get_category_stats(cat)
            display_text = f"{cat} ({stats['percent']}%)"
            item = QListWidgetItem(display_text)
            item.setData(Qt.ItemDataRole.UserRole, cat)
            if stats['percent'] == 100:
                item.setForeground(QColor(ModernTheme.SUCCESS))
            elif stats['percent'] == 0:
                item.setForeground(QColor(ModernTheme.DARK_MUTED))
            self.category_list.addItem(item)
            
        self.category_list.setCurrentRow(0)

    def get_category_stats(self, cat):
        target_lang = self.target_lang_combo.currentText()
        file_path = os.path.join(self.i18n_path, target_lang, f"{cat}.json")
        if not os.path.exists(file_path):
            return {"percent": 0, "translated": 0, "total": 0}
        
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                data = flatten_json(json.load(f))
                total = len(data)
                translated = len([v for v in data.values() if v.strip()])
                percent = int((translated / total) * 100) if total > 0 else 100
                return {"percent": percent, "translated": translated, "total": total}
        except:
            return {"percent": 0, "translated": 0, "total": 0}

    def on_lang_change(self):
        # Prevent recursive calls if combos are cleared
        if self.ref_lang_combo.count() == 0 or self.target_lang_combo.count() == 0:
            return
        self.refresh_categories()
        self.load_selected_category()

    def load_selected_category(self):
        selected_items = self.category_list.selectedItems()
        if not selected_items: return
        
        category_data = selected_items[0].data(Qt.ItemDataRole.UserRole)
        ref_lang = self.ref_lang_combo.currentText()
        target_lang = self.target_lang_combo.currentText()
        
        all_rows = []
        
        cats_to_load = self.categories if category_data == "all" else [category_data]
        
        # Show warning if any category in selection is blacklisted
        blacklist = {"maps", "skills", "misc", "items", "help", "news", "furniture", "armors", "weapons", "enemies"}
        show_warning = any(cat in blacklist for cat in cats_to_load) and not self.warning_dismissed
        self.warning_banner.setVisible(show_warning)
        
        for cat in cats_to_load:
            ref_file = os.path.join(self.i18n_path, ref_lang, f"{cat}.json")
            target_file = os.path.join(self.i18n_path, target_lang, f"{cat}.json")
            
            ref_data = {}
            if os.path.exists(ref_file):
                try:
                    with open(ref_file, 'r', encoding='utf-8') as f:
                        ref_data = flatten_json(json.load(f))
                except: pass
            
            target_data = {}
            if os.path.exists(target_file):
                try:
                    with open(target_file, 'r', encoding='utf-8') as f:
                        target_data = flatten_json(json.load(f))
                except: pass
            
            # Merge keys from both and sort with custom logic
            all_keys = list(set(ref_data.keys()) | set(target_data.keys()))
            all_keys.sort(key=i18n_key_sorter)
            
            for k in all_keys:
                all_rows.append([k, ref_data.get(k, ""), target_data.get(k, ""), cat])
        
        # Calculate group info
        self.calculate_group_info(all_rows)
        
        self.model._data = all_rows
        self.model.layoutChanged.emit()
        self.stats_label.setText(f"{len(all_rows)} keys total")

    def calculate_group_info(self, rows):
        if not rows: return
        
        groups = {} # group_key -> list of indices
        for i, row in enumerate(rows):
            key = row[0]
            group_key = ".".join(key.split('.')[:-1]) if '.' in key else key
            if group_key not in groups: groups[group_key] = []
            groups[group_key].append(i)
            
        for group_key, indices in groups.items():
            size = len(indices)
            for idx in indices[:-1]:
                rows[idx].extend([False, size])
            rows[indices[-1]].extend([True, size])

    def filter_data(self, _=None):
        self.proxy_model.search_text = self.search_input.text()
        self.proxy_model.show_missing_only = self.missing_filter.isChecked()
        self.proxy_model.invalidateFilter()

    def open_revisions(self):
        lang = self.target_lang_combo.currentText()
        if not lang: return
        
        dialog = RevisionsDialog(self.i18n_path, lang, self)
        if dialog.exec():
            self.load_selected_category()

    def submit_pull_request(self):
        lang = self.target_lang_combo.currentText()
        if not lang: return
        
        # 1. Ask for PR details
        dialog = PRDialog(lang, self)
        if not dialog.exec(): return
        
        title = dialog.title_input.text()
        body = dialog.body_input.toPlainText()
        
        # 2. Git operations
        import subprocess
        try:
            # Check if it's a git repo
            subprocess.check_call(["git", "rev-parse", "--is-inside-work-tree"], cwd=self.i18n_path, shell=True)
            
            branch_name = f"translation-{lang}-{datetime.now().strftime('%m%d-%H%M')}"
            
            # Create branch
            subprocess.check_call(["git", "checkout", "-b", branch_name], cwd=self.i18n_path, shell=True)
            
            # Add only the language folder
            rel_lang_path = os.path.relpath(os.path.join(self.i18n_path, lang), os.getcwd())
            subprocess.check_call(["git", "add", os.path.join(lang, "*.json")], cwd=self.i18n_path, shell=True)
            
            # Commit
            subprocess.check_call(["git", "commit", "-m", title], cwd=self.i18n_path, shell=True)
            
            # Push
            subprocess.check_call(["git", "push", "origin", branch_name], cwd=self.i18n_path, shell=True)
            
            # Try PR via gh CLI
            try:
                subprocess.check_call(["gh", "pr", "create", 
                                     "--repo", "nocoldiz/hypernet-explorer-plugins",
                                     "--title", title, 
                                     "--body", body,
                                     "--base", "main",
                                     "--head", branch_name], cwd=self.i18n_path, shell=True)
                QMessageBox.information(self, "Success", f"Pull Request created successfully on {branch_name}")
            except:
                QMessageBox.warning(self, "Partial Success", 
                                  f"Branch '{branch_name}' was pushed, but 'gh' CLI failed to create the PR.\n"
                                  "Please go to GitHub to complete the Pull Request manually.")
                                  
        except Exception as e:
            QMessageBox.critical(self, "Error", f"Git operation failed: {str(e)}")

    def create_backup(self, is_manual=True):
        lang = self.target_lang_combo.currentText()
        if not lang or not self.i18n_path: return
        
        lang_path = os.path.join(self.i18n_path, lang)
        if not os.path.exists(lang_path): return
        
        backup_root = os.path.join(os.path.dirname(self.i18n_path), ".i18n_backups")
        subdir = "snapshots" if is_manual else "autosaves"
        max_keep = 20 if is_manual else 10
        
        target_dir = os.path.join(backup_root, subdir, lang)
        os.makedirs(target_dir, exist_ok=True)
        
        timestamp = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
        backup_path = os.path.join(target_dir, timestamp)
        
        try:
            shutil.copytree(lang_path, backup_path)
            
            # Cleanup old backups
            backups = sorted(os.listdir(target_dir))
            while len(backups) > max_keep:
                oldest = backups.pop(0)
                shutil.rmtree(os.path.join(target_dir, oldest))
        except Exception as e:
            print(f"Backup failed: {e}")

    def save_changes(self):
        target_lang = self.target_lang_combo.currentText()
        if not target_lang: return
        
        # Create backup before saving
        self.create_backup(is_manual=True)
        
        # Group by category
        grouped = {}
        for row in self.model._data:
            cat = row[3]
            key = row[0]
            val = row[2]
            if cat not in grouped: grouped[cat] = {}
            grouped[cat][key] = val
            
        for cat, data in grouped.items():
            file_path = os.path.join(self.i18n_path, target_lang, f"{cat}.json")
            unflattened = unflatten_json(data)
            
            os.makedirs(os.path.dirname(file_path), exist_ok=True)
            with open(file_path, 'w', encoding='utf-8') as f:
                json.dump(unflattened, f, indent=2, ensure_ascii=False)
        
        QMessageBox.information(self, "Success", f"All changes saved to '{target_lang}'")

    def create_new_language(self):
        # Comprehensive list of languages with flags
        iso_langs = [
            ("en", "🇺🇸 English"), ("it", "🇮🇹 Italiano"), ("fr", "🇫🇷 Français"), 
            ("es", "🇪🇸 Español"), ("de", "🇩🇪 Deutsch"), ("pt", "🇵🇹 Português"),
            ("ru", "🇷🇺 Русский"), ("zh", "🇨🇳 中文"), ("ja", "🇯🇵 日本語"), 
            ("ko", "🇰🇷 한국어"), ("ar", "🇸🇦 العربية"), ("hi", "🇮🇳 हिन्दी"),
            ("pl", "🇵🇱 Polski"), ("tr", "🇹🇷 Türkçe"), ("nl", "🇳🇱 Nederlands"),
            ("sv", "🇸🇪 Svenska"), ("da", "🇩🇰 Dansk"), ("fi", "🇫🇮 Suomi"),
            ("no", "🇳🇴 Norsk"), ("el", "🇬🇷 Ελληνικά"), ("cs", "🇨🇿 Čeština"),
            ("hu", "🇭🇺 Magyar"), ("ro", "🇷🇴 Română"), ("uk", "🇺🇦 Українська"),
            ("vi", "🇻🇳 Tiếng Việt"), ("th", "🇹🇭 ไทย"), ("id", "🇮🇩 Indonesia")
        ]
        
        display_items = [f"{flag_name} ({code})" for code, flag_name in iso_langs]
        
        from PyQt6.QtWidgets import QInputDialog
        selection, ok = QInputDialog.getItem(self, "New Language", "Select language to add:", display_items, 0, False)
        
        if ok and selection:
            # Extract code from "Flag Name (code)"
            code = selection.split('(')[-1].replace(')', '').strip().lower()
            
            new_dir = os.path.join(self.i18n_path, code)
            if os.path.exists(new_dir):
                QMessageBox.warning(self, "Warning", f"Language '{code}' already exists.")
                return
            
            os.makedirs(new_dir)
            # Copy all files from 'en' as templates
            en_path = os.path.join(self.i18n_path, 'en')
            if os.path.exists(en_path):
                for f in os.listdir(en_path):
                    if f.endswith('.json'):
                        # Create empty translations for the new language
                        with open(os.path.join(en_path, f), 'r', encoding='utf-8') as src:
                            try:
                                data = json.load(src)
                                def empty_values(d):
                                    if isinstance(d, dict):
                                        return {k: empty_values(v) for k, v in d.items()}
                                    return ""
                                empty_data = empty_values(data)
                                with open(os.path.join(new_dir, f), 'w', encoding='utf-8') as dst:
                                    json.dump(empty_data, dst, indent=2, ensure_ascii=False)
                            except: pass
            
            self.refresh_languages()
            self.target_lang_combo.setCurrentText(code)
            QMessageBox.information(self, "Success", f"Language '{code}' created.")

if __name__ == "__main__":
    app = QApplication(sys.argv)
    window = I18nExplorer()
    window.show()
    sys.exit(app.exec())
