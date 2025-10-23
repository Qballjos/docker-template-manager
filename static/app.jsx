const API_URL = window.location.origin;

function App() {
  const [activeTab, setActiveTab] = React.useState('dashboard');
  const [stats, setStats] = React.useState(null);
  const [templates, setTemplates] = React.useState([]);
  const [containers, setContainers] = React.useState([]);
  const [backups, setBackups] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [selectedTemplates, setSelectedTemplates] = React.useState([]);
  const [apiKey, setApiKey] = React.useState(localStorage.getItem('apiKey') || '');
  const [showApiKeyPrompt, setShowApiKeyPrompt] = React.useState(!localStorage.getItem('apiKey'));
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterStatus, setFilterStatus] = React.useState('all'); // all, matched, unmatched
  const [sortBy, setSortBy] = React.useState('name'); // name, size, date
  const [editingTemplate, setEditingTemplate] = React.useState(null);
  const [editContent, setEditContent] = React.useState('');
  const [renamingTemplate, setRenamingTemplate] = React.useState(null);
  const [newTemplateName, setNewTemplateName] = React.useState('');
  const [theme, setTheme] = React.useState(localStorage.getItem('theme') || 'dark');
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [selectedRow, setSelectedRow] = React.useState(null);

  // Apply theme on mount and change
  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // API helper with authentication
  const fetchWithAuth = async (url, options = {}) => {
    const headers = {
      'X-API-Key': apiKey,
      'Content-Type': 'application/json',
      ...options.headers
    };
    
    const response = await fetch(url, { ...options, headers });
    
    if (response.status === 401) {
      setShowApiKeyPrompt(true);
      localStorage.removeItem('apiKey');
      throw new Error('Unauthorized - Invalid API key');
    }
    
    return response;
  };

  const handleApiKeySubmit = (e) => {
    e.preventDefault();
    const key = e.target.apikey.value.trim();
    if (key) {
      localStorage.setItem('apiKey', key);
      setApiKey(key);
      setShowApiKeyPrompt(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm('Clear API key and logout?')) {
      localStorage.removeItem('apiKey');
      setApiKey('');
      setShowApiKeyPrompt(true);
    }
  };

  React.useEffect(() => {
    if (apiKey && !showApiKeyPrompt) {
      fetchStats();
      fetchTemplates();
      fetchContainers();
      fetchBackups();
    }
  }, [apiKey, showApiKeyPrompt]);

  const fetchStats = async () => {
    try {
      const response = await fetchWithAuth(`${API_URL}/api/stats`);
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const response = await fetchWithAuth(`${API_URL}/api/templates`);
      const data = await response.json();
      setTemplates(data);
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
    setLoading(false);
  };

  const fetchContainers = async () => {
    try {
      const response = await fetchWithAuth(`${API_URL}/api/containers`);
      const data = await response.json();
      setContainers(data);
    } catch (error) {
      console.error('Error fetching containers:', error);
    }
  };

  const fetchBackups = async () => {
    try {
      const response = await fetchWithAuth(`${API_URL}/api/backups`);
      const data = await response.json();
      setBackups(data);
    } catch (error) {
      console.error('Error fetching backups:', error);
    }
  };

  const handleDeleteTemplate = async (filename) => {
    if (!window.confirm(`Are you sure you want to delete ${filename}?`)) {
      return;
    }

    try {
      const response = await fetchWithAuth(`${API_URL}/api/templates/${filename}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        alert('Template deleted successfully');
        fetchTemplates();
        fetchStats();
      } else {
        alert('Error deleting template');
      }
    } catch (error) {
      console.error('Error deleting template:', error);
      alert('Error deleting template');
    }
  };

  const handleCloneTemplate = async (filename) => {
    const baseName = filename.replace('.xml', '');
    const defaultName = `${baseName}-copy`;
    
    const newName = prompt(`Clone "${filename}" as:`, defaultName);
    
    if (!newName) return; // Cancelled
    
    const trimmedName = newName.trim();
    if (!trimmedName) {
      alert('Template name cannot be empty');
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetchWithAuth(`${API_URL}/api/templates/${filename}/clone`, {
        method: 'POST',
        body: JSON.stringify({ new_name: trimmedName })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        alert(data.message || `Template cloned as ${data.filename}`);
        fetchTemplates();
        fetchStats();
      } else {
        alert(data.error || 'Failed to clone template');
      }
    } catch (error) {
      console.error('Error cloning template:', error);
      alert('Error cloning template');
    }
    setLoading(false);
  };

  const handleViewTemplate = async (filename) => {
    setLoading(true);
    try {
      const response = await fetchWithAuth(`${API_URL}/api/templates/${filename}`);
      const data = await response.json();
      
      if (response.ok) {
        setEditingTemplate(filename);
        setEditContent(data.content);
      } else {
        alert('Failed to load template');
      }
    } catch (error) {
      console.error('Error loading template:', error);
      alert('Error loading template');
    }
    setLoading(false);
  };

  const handleSaveTemplate = async () => {
    if (!editingTemplate) return;
    
    setLoading(true);
    try {
      const response = await fetchWithAuth(`${API_URL}/api/templates/${editingTemplate}/edit`, {
        method: 'PUT',
        body: JSON.stringify({ content: editContent })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        alert(data.message || 'Template saved successfully');
        setEditingTemplate(null);
        setEditContent('');
        fetchTemplates();
      } else {
        alert(data.error || 'Failed to save template');
      }
    } catch (error) {
      console.error('Error saving template:', error);
      alert('Error saving template');
    }
    setLoading(false);
  };

  const handleCloseEditor = () => {
    if (editContent && window.confirm('You have unsaved changes. Close anyway?')) {
      setEditingTemplate(null);
      setEditContent('');
    } else if (!editContent) {
      setEditingTemplate(null);
      setEditContent('');
    }
  };

  const handleRenameTemplate = (filename) => {
    const baseName = filename.replace('.xml', '');
    setRenamingTemplate(filename);
    setNewTemplateName(baseName);
  };

  const handleSaveRename = async () => {
    if (!renamingTemplate || !newTemplateName.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetchWithAuth(`${API_URL}/api/templates/${renamingTemplate}/rename`, {
        method: 'PATCH',
        body: JSON.stringify({ new_name: newTemplateName.trim() })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        alert(data.message || 'Template renamed successfully');
        setRenamingTemplate(null);
        setNewTemplateName('');
        fetchTemplates();
        fetchStats();
      } else {
        alert(data.error || 'Failed to rename template');
      }
    } catch (error) {
      console.error('Error renaming template:', error);
      alert('Error renaming template');
    }
    setLoading(false);
  };

  const handleContainerAction = async (containerName, action) => {
    setLoading(true);
    try {
      const response = await fetchWithAuth(`${API_URL}/api/containers/${containerName}/${action}`, {
        method: 'POST'
      });
      
      const data = await response.json();
      
      if (response.ok) {
        alert(data.message || `Container ${action}ed successfully`);
        fetchContainers();
      } else {
        alert(data.error || `Failed to ${action} container`);
      }
    } catch (error) {
      console.error(`Error ${action}ing container:`, error);
      alert(`Error ${action}ing container`);
    }
    setLoading(false);
  };

  const getPageTitle = () => {
    const titles = {
      'dashboard': 'Dashboard',
      'templates': `Templates (${getFilteredAndSortedTemplates().length}/${templates.length})`,
      'containers': `Containers (${containers.length})`,
      'backups': `Backups (${backups.length})`
    };
    return titles[activeTab] || 'Dashboard';
  };

  const handleCleanupTemplates = async (dryRun = true) => {
    setLoading(true);
    try {
      const response = await fetchWithAuth(`${API_URL}/api/templates/cleanup`, {
        method: 'POST',
        body: JSON.stringify({ dry_run: dryRun })
      });
      
      const data = await response.json();
      
      if (dryRun) {
        const unusedCount = data.unused_templates.length;
        if (unusedCount > 0) {
          if (window.confirm(`Found ${unusedCount} unused templates. Delete them?`)) {
            handleCleanupTemplates(false);
          }
        } else {
          alert('No unused templates found!');
        }
      } else {
        alert(`Deleted ${data.count} unused templates`);
        fetchTemplates();
        fetchStats();
      }
    } catch (error) {
      console.error('Error cleaning up templates:', error);
      alert('Error cleaning up templates');
    }
    setLoading(false);
  };

  const handleCreateBackup = async () => {
    setLoading(true);
    try {
      const response = await fetchWithAuth(`${API_URL}/api/backups`, {
        method: 'POST',
        body: JSON.stringify({})
      });
      
      const data = await response.json();
      if (data.success) {
        alert(`Backup created: ${data.backup_name}`);
        fetchBackups();
      }
    } catch (error) {
      console.error('Error creating backup:', error);
      alert('Error creating backup');
    }
    setLoading(false);
  };

  const handleDeleteBackup = async (backupName) => {
    if (!window.confirm(`Delete backup ${backupName}?`)) {
      return;
    }

    try {
      const response = await fetchWithAuth(`${API_URL}/api/backups/${backupName}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        alert('Backup deleted');
        fetchBackups();
      }
    } catch (error) {
      console.error('Error deleting backup:', error);
      alert('Error deleting backup');
    }
  };

  const handleRestoreBackup = async (backupName) => {
    if (!window.confirm(`Restore templates from backup ${backupName}? This will copy all templates from the backup to your templates directory. Existing templates with the same name will be overwritten.`)) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetchWithAuth(`${API_URL}/api/backups/${backupName}/restore`, {
        method: 'POST'
      });
      
      const data = await response.json();
      
      if (response.ok) {
        alert(data.message || 'Backup restored successfully');
        fetchTemplates();
        fetchStats();
      } else {
        alert(data.error || 'Error restoring backup');
      }
    } catch (error) {
      console.error('Error restoring backup:', error);
      alert('Error restoring backup');
    }
    setLoading(false);
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (isoString) => {
    return new Date(isoString).toLocaleString();
  };

  // Simple SVG Pie Chart Component
  const PieChart = ({ matched, unmatched }) => {
    const total = matched + unmatched;
    if (total === 0) return null;
    
    const matchedPercent = (matched / total) * 100;
    const unmatchedPercent = (unmatched / total) * 100;
    
    // Calculate pie chart segments
    const matchedAngle = (matched / total) * 360;
    const unmatchedAngle = (unmatched / total) * 360;
    
    const getCoordinatesForPercent = (percent) => {
      const x = Math.cos(2 * Math.PI * percent);
      const y = Math.sin(2 * Math.PI * percent);
      return [x, y];
    };
    
    const matchedPath = () => {
      const [startX, startY] = getCoordinatesForPercent(0);
      const [endX, endY] = getCoordinatesForPercent(matched / total);
      const largeArcFlag = matched / total > 0.5 ? 1 : 0;
      
      return [
        `M 0 0`,
        `L ${startX} ${startY}`,
        `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`,
        `Z`
      ].join(' ');
    };
    
    const unmatchedPath = () => {
      const [startX, startY] = getCoordinatesForPercent(matched / total);
      const [endX, endY] = getCoordinatesForPercent(1);
      const largeArcFlag = unmatched / total > 0.5 ? 1 : 0;
      
      return [
        `M 0 0`,
        `L ${startX} ${startY}`,
        `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`,
        `Z`
      ].join(' ');
    };
    
    return React.createElement('div', { className: 'pie-chart-container' },
      React.createElement('svg', { viewBox: '-1 -1 2 2', className: 'pie-chart' },
        React.createElement('path', {
          d: matchedPath(),
          fill: '#5cb85c',
          stroke: '#1b1b1b',
          strokeWidth: '0.02'
        }),
        React.createElement('path', {
          d: unmatchedPath(),
          fill: '#f0ad4e',
          stroke: '#1b1b1b',
          strokeWidth: '0.02'
        })
      ),
      React.createElement('div', { className: 'chart-legend' },
        React.createElement('div', { className: 'legend-item' },
          React.createElement('span', { className: 'legend-color', style: { background: '#5cb85c' } }),
          React.createElement('span', null, `Matched: ${matched} (${matchedPercent.toFixed(1)}%)`)
        ),
        React.createElement('div', { className: 'legend-item' },
          React.createElement('span', { className: 'legend-color', style: { background: '#f0ad4e' } }),
          React.createElement('span', null, `Unused: ${unmatched} (${unmatchedPercent.toFixed(1)}%)`)
        )
      )
    );
  };

  const toggleTemplateSelection = (filename) => {
    setSelectedTemplates(prev => 
      prev.includes(filename) 
        ? prev.filter(f => f !== filename)
        : [...prev, filename]
    );
  };

  const handleDeleteSelected = async () => {
    if (selectedTemplates.length === 0) {
      alert('No templates selected');
      return;
    }

    if (!window.confirm(`Delete ${selectedTemplates.length} selected templates?`)) {
      return;
    }

    setLoading(true);
    for (const filename of selectedTemplates) {
      try {
        await fetchWithAuth(`${API_URL}/api/templates/${filename}`, { method: 'DELETE' });
      } catch (error) {
        console.error(`Error deleting ${filename}:`, error);
      }
    }
    setSelectedTemplates([]);
    fetchTemplates();
    fetchStats();
    setLoading(false);
    alert(`Deleted ${selectedTemplates.length} templates`);
  };

  // Filter and sort templates
  const getFilteredAndSortedTemplates = () => {
    let filtered = templates;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(t => 
        t.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (t.container && t.container.name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply status filter
    if (filterStatus === 'matched') {
      filtered = filtered.filter(t => t.matched);
    } else if (filterStatus === 'unmatched') {
      filtered = filtered.filter(t => !t.matched);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      if (sortBy === 'name') {
        return a.filename.localeCompare(b.filename);
      } else if (sortBy === 'size') {
        return b.size - a.size;
      } else if (sortBy === 'date') {
        return new Date(b.modified) - new Date(a.modified);
      }
      return 0;
    });

    return filtered;
  };

  return React.createElement('div', { className: 'app-container' },
    // API Key Prompt Modal
    showApiKeyPrompt && React.createElement('div', { className: 'modal-overlay' },
      React.createElement('div', { className: 'modal' },
        React.createElement('h2', null, '🔑 API Key Required'),
        React.createElement('p', null, 'Enter your API key to access Docker Template Manager.'),
        React.createElement('p', { className: 'text-small text-muted' }, 
          'Find your API key in Docker logs: Docker tab → Container icon → Logs'),
        React.createElement('form', { onSubmit: handleApiKeySubmit },
          React.createElement('input', {
            type: 'password',
            name: 'apikey',
            placeholder: 'Enter API key',
            autoFocus: true,
            required: true,
            style: { width: '100%', padding: '10px', marginBottom: '10px', fontSize: '14px' }
          }),
          React.createElement('button', { type: 'submit', className: 'btn-primary' }, 'Submit')
        )
      )
    ),
    // Template Editor Modal
    editingTemplate && React.createElement('div', { className: 'modal-overlay' },
      React.createElement('div', { className: 'modal modal-large' },
        React.createElement('div', { className: 'modal-header' },
          React.createElement('h2', null, `✏️ Edit: ${editingTemplate}`),
          React.createElement('button', {
            className: 'close-button',
            onClick: handleCloseEditor
          }, '✕')
        ),
        React.createElement('div', { className: 'modal-body' },
          React.createElement('textarea', {
            className: 'code-editor',
            value: editContent,
            onChange: (e) => setEditContent(e.target.value),
            spellCheck: false,
            rows: 20
          })
        ),
        React.createElement('div', { className: 'modal-footer' },
          React.createElement('button', {
            className: 'btn-secondary',
            onClick: handleCloseEditor
          }, 'Cancel'),
          React.createElement('button', {
            className: 'btn-primary',
            onClick: handleSaveTemplate,
            disabled: loading
          }, loading ? 'Saving...' : 'Save Changes')
        )
      )
    ),
    // Rename Template Modal
    renamingTemplate && React.createElement('div', { className: 'modal-overlay' },
      React.createElement('div', { className: 'modal' },
        React.createElement('h2', null, '✏️ Rename Template'),
        React.createElement('p', null, `Renaming: ${renamingTemplate}`),
        React.createElement('div', { style: { marginBottom: '15px' } },
          React.createElement('label', { style: { display: 'block', marginBottom: '5px', color: 'var(--unraid-text-secondary)' } }, 'New name:'),
          React.createElement('input', {
            type: 'text',
            value: newTemplateName,
            onChange: (e) => setNewTemplateName(e.target.value),
            placeholder: 'template-name',
            style: { width: '100%', padding: '10px', fontSize: '14px' },
            autoFocus: true
          })
        ),
        React.createElement('div', { className: 'modal-footer' },
          React.createElement('button', {
            className: 'btn-secondary',
            onClick: () => {
              setRenamingTemplate(null);
              setNewTemplateName('');
            }
          }, 'Cancel'),
          React.createElement('button', {
            className: 'btn-primary',
            onClick: handleSaveRename,
            disabled: loading || !newTemplateName.trim()
          }, loading ? 'Renaming...' : 'Rename')
        )
      )
    ),
    // Sidebar Navigation
    !showApiKeyPrompt && React.createElement('aside', { 
      className: `sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`
    },
      // Sidebar Header
      React.createElement('div', { className: 'sidebar-header' },
        React.createElement('div', { className: 'sidebar-logo' }, 
          React.createElement('img', { 
            src: '/static/png/logo.png', 
            alt: 'Docker Template Manager',
            style: { width: '48px', height: '48px' }
          })
        )
      ),
      // Sidebar Navigation
      React.createElement('nav', { className: 'sidebar-nav' },
        React.createElement('div', {
          className: `nav-item ${activeTab === 'dashboard' ? 'active' : ''}`,
          onClick: () => { setActiveTab('dashboard'); setMobileMenuOpen(false); }
        },
          React.createElement('span', { className: 'nav-icon' }, '📊'),
          React.createElement('span', null, 'Dashboard')
        ),
        React.createElement('div', {
          className: `nav-item ${activeTab === 'templates' ? 'active' : ''}`,
          onClick: () => { setActiveTab('templates'); setMobileMenuOpen(false); }
        },
          React.createElement('span', { className: 'nav-icon' }, '📄'),
          React.createElement('span', null, 'Templates')
        ),
        React.createElement('div', {
          className: `nav-item ${activeTab === 'containers' ? 'active' : ''}`,
          onClick: () => { setActiveTab('containers'); setMobileMenuOpen(false); }
        },
          React.createElement('span', { className: 'nav-icon' }, '📦'),
          React.createElement('span', null, 'Containers')
        ),
        React.createElement('div', {
          className: `nav-item ${activeTab === 'backups' ? 'active' : ''}`,
          onClick: () => { setActiveTab('backups'); setMobileMenuOpen(false); }
        },
          React.createElement('span', { className: 'nav-icon' }, '💾'),
          React.createElement('span', null, 'Backups')
        )
      ),
      // Sidebar Footer
      React.createElement('div', { className: 'sidebar-footer' },
        React.createElement('div', { className: 'theme-toggle', onClick: toggleTheme },
          React.createElement('span', { className: 'theme-label' },
            React.createElement('span', null, theme === 'dark' ? '🌙' : '☀️'),
            React.createElement('span', null, theme === 'dark' ? 'Dark' : 'Light')
          ),
          React.createElement('div', { className: `theme-switch ${theme === 'dark' ? 'active' : ''}` },
            React.createElement('div', { className: 'theme-switch-thumb' })
          )
        ),
        React.createElement('button', {
          onClick: handleLogout,
          style: { 
            width: '100%', 
            marginTop: '10px', 
            padding: '10px', 
            background: 'var(--unraid-bg-tertiary)',
            border: '1px solid var(--unraid-border)',
            borderRadius: '6px',
            color: 'var(--unraid-text-secondary)',
            cursor: 'pointer',
            fontSize: '13px'
          }
        }, '🔓 Logout')
      )
    ),
    // Mobile Overlay
    !showApiKeyPrompt && mobileMenuOpen && React.createElement('div', {
      className: 'sidebar-overlay active',
      onClick: () => setMobileMenuOpen(false)
    }),
    // Main Content
    !showApiKeyPrompt && React.createElement('main', { className: 'main-content' },
      // Top Bar
      React.createElement('div', { className: 'top-bar' },
        React.createElement('div', { className: 'top-bar-title' },
          React.createElement('div', { className: 'breadcrumb' },
            React.createElement('span', { className: 'breadcrumb-item' }, 'Docker Template Manager'),
            React.createElement('span', { className: 'breadcrumb-separator' }, '›'),
            React.createElement('span', { className: 'breadcrumb-current' }, getPageTitle())
          )
        ),
        React.createElement('div', { className: 'top-bar-actions' },
          activeTab === 'templates' && React.createElement('button', {
            className: 'top-bar-button primary',
            onClick: () => handleCleanupTemplates(true),
            disabled: loading
          }, '🧹 Cleanup'),
          activeTab === 'backups' && React.createElement('button', {
            className: 'top-bar-button primary',
            onClick: handleCreateBackup,
            disabled: loading
          }, '💾 Create Backup')
        )
      ),
      // Content Wrapper
      React.createElement('div', { className: 'content-wrapper' },
      activeTab === 'dashboard' && stats ? React.createElement('div', { className: 'dashboard' },
        React.createElement('div', { className: 'stats-grid' },
          React.createElement('div', { className: 'stat-card' },
            React.createElement('h3', null, 'Templates'),
            React.createElement('div', { className: 'stat-value' }, stats.total_templates),
            React.createElement('div', { className: 'stat-detail' }, 
              `${stats.matched_templates} matched, ${stats.unmatched_templates} unused`)
          ),
          React.createElement('div', { className: 'stat-card' },
            React.createElement('h3', null, 'Containers'),
            React.createElement('div', { className: 'stat-value' }, stats.total_containers),
            React.createElement('div', { className: 'stat-detail' }, 
              `${stats.running_containers} running`)
          ),
          React.createElement('div', { className: 'stat-card' },
            React.createElement('h3', null, 'Backups'),
            React.createElement('div', { className: 'stat-value' }, stats.total_backups)
          )
        ),
        // Pie Chart
        stats.total_templates > 0 && React.createElement('div', { className: 'chart-section' },
          React.createElement('h3', null, 'Template Status Overview'),
          React.createElement(PieChart, {
            matched: stats.matched_templates,
            unmatched: stats.unmatched_templates
          })
        ),
        stats.unmatched_templates > 0 && React.createElement('div', { className: 'alert alert-warning' },
          React.createElement('strong', null, `⚠️ ${stats.unmatched_templates} unused templates detected`),
          React.createElement('button', { onClick: () => handleCleanupTemplates(true), disabled: loading }, 
            'Clean Up Unused Templates')
        ),
        React.createElement('div', { className: 'quick-actions' },
          React.createElement('h3', null, 'Quick Actions'),
          React.createElement('button', { onClick: () => handleCreateBackup(), disabled: loading }, 
            '💾 Create Backup'),
          React.createElement('button', { onClick: () => fetchStats() }, 
            '🔄 Refresh Stats')
        ),
        // Migration Guide Section
        React.createElement('div', { className: 'migration-guide-section' },
          React.createElement('h3', null, '📚 Docker Migration Guides'),
          React.createElement('div', { className: 'migration-cards' },
            // vDisk to Folder Guide
            React.createElement('div', { className: 'migration-card' },
              React.createElement('h4', null, '🔄 vDisk → Folder Migration'),
              React.createElement('p', { className: 'migration-desc' }, 'Convert your Docker containers from vdisk.img to folder-based storage'),
              React.createElement('div', { className: 'pros-cons' },
                React.createElement('div', { className: 'pros' },
                  React.createElement('strong', null, '✅ Pros:'),
                  React.createElement('ul', null,
                    React.createElement('li', null, 'Better performance'),
                    React.createElement('li', null, 'Easier backups'),
                    React.createElement('li', null, 'No size limits'),
                    React.createElement('li', null, 'Direct file access')
                  )
                ),
                React.createElement('div', { className: 'cons' },
                  React.createElement('strong', null, '⚠️ Cons:'),
                  React.createElement('ul', null,
                    React.createElement('li', null, 'Requires migration time'),
                    React.createElement('li', null, 'Need free space'),
                    React.createElement('li', null, 'Risk if not backed up')
                  )
                )
              ),
              React.createElement('button', {
                className: 'migration-button',
                onClick: () => window.open('https://wiki.unraid.net/Docker_Migration#From_vDisk_to_Folder', '_blank')
              }, '📖 View Guide')
            ),
            // Folder to vDisk Guide
            React.createElement('div', { className: 'migration-card' },
              React.createElement('h4', null, '🔄 Folder → vDisk Migration'),
              React.createElement('p', { className: 'migration-desc' }, 'Convert your Docker containers from folder-based to vdisk.img storage'),
              React.createElement('div', { className: 'pros-cons' },
                React.createElement('div', { className: 'pros' },
                  React.createElement('strong', null, '✅ Pros:'),
                  React.createElement('ul', null,
                    React.createElement('li', null, 'Single file simplicity'),
                    React.createElement('li', null, 'Easier to move'),
                    React.createElement('li', null, 'Contained environment')
                  )
                ),
                React.createElement('div', { className: 'cons' },
                  React.createElement('strong', null, '⚠️ Cons:'),
                  React.createElement('ul', null,
                    React.createElement('li', null, 'Size limitations'),
                    React.createElement('li', null, 'Slower performance'),
                    React.createElement('li', null, 'Harder to backup'),
                    React.createElement('li', null, 'No direct file access')
                  )
                )
              ),
              React.createElement('button', {
                className: 'migration-button',
                onClick: () => window.open('https://wiki.unraid.net/Docker_Migration#From_Folder_to_vDisk', '_blank')
              }, '📖 View Guide')
            )
          ),
          React.createElement('div', { className: 'migration-note' },
            React.createElement('strong', null, '💡 Tip: '),
            React.createElement('span', null, 'Always create a backup before migrating! Use the backup feature above.')
          )
        )
      ) : null,
      activeTab === 'templates' ? React.createElement('div', { className: 'templates' },
        React.createElement('div', { className: 'section-header' },
          React.createElement('div', { className: 'actions' },
            selectedTemplates.length > 0 && React.createElement(React.Fragment, null,
              React.createElement('span', null, `${selectedTemplates.length} selected`),
              React.createElement('button', { onClick: handleDeleteSelected, disabled: loading }, 
                '🗑️ Delete Selected')
            ),
            React.createElement('button', { onClick: () => handleCleanupTemplates(true), disabled: loading }, 
              '🧹 Clean Up Unused')
          )
        ),
        // Search and Filter Bar
        React.createElement('div', { className: 'filter-bar' },
          React.createElement('div', { className: 'search-box' },
            React.createElement('input', {
              type: 'text',
              placeholder: '🔍 Search templates...',
              value: searchTerm,
              onChange: (e) => setSearchTerm(e.target.value),
              className: 'search-input'
            }),
            searchTerm && React.createElement('button', {
              onClick: () => setSearchTerm(''),
              className: 'clear-search',
              title: 'Clear search'
            }, '✕')
          ),
          React.createElement('div', { className: 'filter-controls' },
            React.createElement('select', {
              value: filterStatus,
              onChange: (e) => setFilterStatus(e.target.value),
              className: 'filter-select'
            },
              React.createElement('option', { value: 'all' }, 'All Templates'),
              React.createElement('option', { value: 'matched' }, '✓ Matched Only'),
              React.createElement('option', { value: 'unmatched' }, '✗ Unused Only')
            ),
            React.createElement('select', {
              value: sortBy,
              onChange: (e) => setSortBy(e.target.value),
              className: 'filter-select'
            },
              React.createElement('option', { value: 'name' }, 'Sort: Name'),
              React.createElement('option', { value: 'size' }, 'Sort: Size'),
              React.createElement('option', { value: 'date' }, 'Sort: Date')
            )
          )
        ),
        loading ? React.createElement('div', { className: 'loading' }, 'Loading...') : 
        React.createElement('div', { className: 'table-container' },
          React.createElement('table', null,
            React.createElement('thead', null,
              React.createElement('tr', null,
                React.createElement('th', null, 
                  React.createElement('input', { 
                    type: 'checkbox',
                    onChange: (e) => {
                      if (e.target.checked) {
                        setSelectedTemplates(templates.map(t => t.filename));
                      } else {
                        setSelectedTemplates([]);
                      }
                    },
                    checked: selectedTemplates.length === templates.length && templates.length > 0
                  })
                ),
                React.createElement('th', null, 'Status'),
                React.createElement('th', null, 'Template'),
                React.createElement('th', null, 'Container'),
                React.createElement('th', null, 'Size'),
                React.createElement('th', null, 'Modified'),
                React.createElement('th', null, 'Actions')
              )
            ),
            React.createElement('tbody', null,
              getFilteredAndSortedTemplates().map(template => React.createElement('tr', { 
                key: template.filename, 
                className: `${template.matched ? '' : 'unused'} ${selectedRow === template.filename ? 'selected-row' : ''}`,
                onClick: () => setSelectedRow(selectedRow === template.filename ? null : template.filename),
                style: { cursor: 'pointer' }
              },
                React.createElement('td', { className: 'checkbox-cell' },
                  React.createElement('input', {
                    type: 'checkbox',
                    checked: selectedTemplates.includes(template.filename),
                    onChange: (e) => { e.stopPropagation(); toggleTemplateSelection(template.filename); }
                  })
                ),
                React.createElement('td', null,
                  template.matched ? 
                    React.createElement('span', { className: 'status-badge status-matched' }, '✓ Matched') :
                    React.createElement('span', { className: 'status-badge status-unused' }, '✗ Unused')
                ),
                React.createElement('td', null, React.createElement('strong', null, template.filename)),
                React.createElement('td', null,
                  template.container ? 
                    React.createElement('span', { className: 'container-name' }, template.container.name) :
                    React.createElement('span', { className: 'text-muted' }, '-')
                ),
                React.createElement('td', null, formatBytes(template.size)),
                React.createElement('td', null, formatDate(template.modified)),
                React.createElement('td', null,
                  selectedRow === template.filename ? React.createElement('div', { className: 'action-buttons' },
                    React.createElement('button', {
                      className: 'btn-small btn-primary',
                      onClick: (e) => { e.stopPropagation(); handleViewTemplate(template.filename); },
                      title: 'View/Edit template'
                    }, '👁️ View'),
                    React.createElement('button', {
                      className: 'btn-small btn-secondary',
                      onClick: (e) => { e.stopPropagation(); handleRenameTemplate(template.filename); },
                      title: 'Rename template'
                    }, '✏️ Rename'),
                    React.createElement('button', {
                      className: 'btn-small btn-secondary',
                      onClick: (e) => { e.stopPropagation(); handleCloneTemplate(template.filename); },
                      title: 'Clone template'
                    }, '📋 Clone'),
                    React.createElement('button', {
                      className: 'btn-small btn-danger',
                      onClick: (e) => { e.stopPropagation(); handleDeleteTemplate(template.filename); },
                      title: 'Delete template'
                    }, '🗑️ Delete')
                  ) : null
                )
              ))
            )
          )
        )
      ) : null,
      activeTab === 'containers' ? React.createElement('div', { className: 'containers' },
        React.createElement('div', { className: 'section-header' },
          React.createElement('button', { onClick: fetchContainers }, '🔄 Refresh')
        ),
        React.createElement('div', { className: 'table-container' },
          React.createElement('table', null,
            React.createElement('thead', null,
              React.createElement('tr', null,
                React.createElement('th', null, 'Status'),
                React.createElement('th', null, 'Name'),
                React.createElement('th', null, 'Image'),
                React.createElement('th', null, 'State'),
                React.createElement('th', null, 'Template'),
                React.createElement('th', null, 'Actions')
              )
            ),
            React.createElement('tbody', null,
              containers.map(container => React.createElement('tr', { key: container.id },
                React.createElement('td', null,
                  React.createElement('span', { className: `status-indicator status-${container.state}` },
                    container.state === 'running' ? '🟢' : '🔴')
                ),
                React.createElement('td', null,
                  React.createElement('strong', null, container.name),
                  React.createElement('div', { className: 'text-small text-muted' }, container.id)
                ),
                React.createElement('td', { className: 'text-small' }, container.image),
                React.createElement('td', null,
                  React.createElement('span', { className: `badge badge-${container.state}` }, container.status)
                ),
                React.createElement('td', null,
                  container.has_template ? 
                    React.createElement('span', { className: 'status-badge status-matched' }, 
                      `✓ ${container.template.filename}`) :
                    React.createElement('span', { className: 'status-badge status-warning' }, 
                      '⚠️ No template')
                ),
                React.createElement('td', null,
                  React.createElement('div', { className: 'action-buttons' },
                    container.state === 'running' ? React.createElement(React.Fragment, null,
                      React.createElement('button', {
                        className: 'btn-small btn-danger',
                        onClick: () => handleContainerAction(container.name, 'stop'),
                        disabled: loading,
                        title: 'Stop container'
                      }, '■ Stop'),
                      React.createElement('button', {
                        className: 'btn-small btn-secondary',
                        onClick: () => handleContainerAction(container.name, 'restart'),
                        disabled: loading,
                        title: 'Restart container'
                      }, '↻ Restart')
                    ) : React.createElement('button', {
                      className: 'btn-small btn-success',
                      onClick: () => handleContainerAction(container.name, 'start'),
                      disabled: loading,
                      title: 'Start container'
                    }, '▶ Start')
                  )
                )
              ))
            )
          )
        )
      ) : null,
      activeTab === 'backups' ? React.createElement('div', { className: 'backups' },
        React.createElement('div', { className: 'section-header' },
          React.createElement('button', { onClick: handleCreateBackup, disabled: loading }, 
            '💾 Create New Backup')
        ),
        backups.length === 0 ? 
          React.createElement('div', { className: 'empty-state' },
            React.createElement('p', null, 'No backups yet. Create your first backup to get started.'),
            React.createElement('button', { onClick: handleCreateBackup, disabled: loading }, 
              'Create Backup')
          ) :
          React.createElement('div', { className: 'backup-list' },
            backups.map(backup => React.createElement('div', { key: backup.name, className: 'backup-card' },
              React.createElement('div', { className: 'backup-header' },
                React.createElement('h3', null, backup.name)
              ),
              React.createElement('div', { className: 'backup-details' },
                React.createElement('div', { className: 'backup-detail' },
                  React.createElement('span', { className: 'label' }, 'Created:'),
                  React.createElement('span', null, formatDate(backup.created))
                ),
                React.createElement('div', { className: 'backup-detail' },
                  React.createElement('span', { className: 'label' }, 'Size:'),
                  React.createElement('span', null, formatBytes(backup.size))
                ),
                backup.container_count && React.createElement('div', { className: 'backup-detail' },
                  React.createElement('span', { className: 'label' }, 'Containers:'),
                  React.createElement('span', null, backup.container_count)
                ),
                backup.template_count && React.createElement('div', { className: 'backup-detail' },
                  React.createElement('span', { className: 'label' }, 'Templates:'),
                  React.createElement('span', null, backup.template_count)
                )
              ),
              React.createElement('div', { className: 'backup-actions' },
                React.createElement('button', { 
                  className: 'btn-primary',
                  onClick: () => handleRestoreBackup(backup.name),
                  disabled: loading
                }, '🔄 Restore'),
                React.createElement('button', { 
                  className: 'btn-danger',
                  onClick: () => handleDeleteBackup(backup.name),
                  disabled: loading
                }, '🗑️ Delete')
              )
            ))
          )
      ) : null
    ),
    // Close content-wrapper
    React.createElement('footer', { className: 'footer' },
      React.createElement('p', null, 'Docker Template Manager v1.3.0 | Made for Unraid')
    )
    // Close main-content
    ),
    // Mobile Menu Button
    !showApiKeyPrompt && React.createElement('button', {
      className: 'mobile-menu-button',
      onClick: () => setMobileMenuOpen(!mobileMenuOpen)
    }, mobileMenuOpen ? '✕' : '☰')
  );
}

// Export for global access
window.App = App;