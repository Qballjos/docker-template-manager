function App() {function App() {

  // State declarations  return React.createElement('div', null, 'Hello World');

  const [activeTab, setActiveTab] = React.useState('dashboard');}

  const [stats, setStats] = React.useState(null);window.App = App;

  const [templates, setTemplates] = React.useState([]);  const [activeTab, setActiveTab] = React.useState('dashboard');

  const [containers, setContainers] = React.useState([]);  const [stats, setStats] = React.useState(null);

  const [backups, setBackups] = React.useState([]);  const [templates, setTemplates] = React.useState([]);

  const [loading, setLoading] = React.useState(false);  const [containers, setContainers] = React.useState([]);

  const [selectedTemplates, setSelectedTemplates] = React.useState([]);  const [backups, setBackups] = React.useState([]);

  const [selectedContainers, setSelectedContainers] = React.useState([]);  const [loading, setLoading] = React.useState(false);

  const [selectedContainerRow, setSelectedContainerRow] = React.useState(null);  const [selectedTemplates, setSelectedTemplates] = React.useState([]);

  const [apiKey, setApiKey] = React.useState(localStorage.getItem('apiKey') || '');  const [selectedContainers, setSelectedContainers] = React.useState([]);

  const [showApiKeyPrompt, setShowApiKeyPrompt] = React.useState(!localStorage.getItem('apiKey'));  const [selectedContainerRow, setSelectedContainerRow] = React.useState(null);

  const [searchTerm, setSearchTerm] = React.useState('');  const [apiKey, setApiKey] = React.useState(localStorage.getItem('apiKey') || '');

  const [filterStatus, setFilterStatus] = React.useState('all'); // all, matched, unmatched  const [showApiKeyPrompt, setShowApiKeyPrompt] = React.useState(!localStorage.getItem('apiKey'));

  const [sortBy, setSortBy] = React.useState('name'); // name, size, date  const [searchTerm, setSearchTerm] = React.useState('');

  const [editingTemplate, setEditingTemplate] = React.useState(null);  const [filterStatus, setFilterStatus] = React.useState('all'); // all, matched, unmatched

  const [editContent, setEditContent] = React.useState('');  const [sortBy, setSortBy] = React.useState('name'); // name, size, date

  const [renamingTemplate, setRenamingTemplate] = React.useState(null);  const [editingTemplate, setEditingTemplate] = React.useState(null);

  const [newTemplateName, setNewTemplateName] = React.useState('');  const [editContent, setEditContent] = React.useState('');

  const [theme, setTheme] = React.useState(localStorage.getItem('theme') || 'dark');  const [renamingTemplate, setRenamingTemplate] = React.useState(null);

  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);  const [newTemplateName, setNewTemplateName] = React.useState('');

  const [selectedRow, setSelectedRow] = React.useState(null);  const [theme, setTheme] = React.useState(localStorage.getItem('theme') || 'dark');

  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  // Apply theme on mount and change  const [selectedRow, setSelectedRow] = React.useState(null);

  React.useEffect(() => {

    document.documentElement.setAttribute('data-theme', theme);  // Apply theme on mount and change

    localStorage.setItem('theme', theme);  React.useEffect(() => {

  }, [theme]);    document.documentElement.setAttribute('data-theme', theme);

    localStorage.setItem('theme', theme);

  const toggleTheme = () => {  }, [theme]);

    setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  };  const toggleTheme = () => {

    setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  // API helper with authentication  };

  const fetchWithAuth = async (url, options = {}) => {

    const headers = {  // API helper with authentication

      'X-API-Key': apiKey,  const fetchWithAuth = async (url, options = {}) => {

      'Content-Type': 'application/json',    const headers = {

      ...options.headers      'X-API-Key': apiKey,

    };      'Content-Type': 'application/json',

          ...options.headers

    const response = await fetch(url, { ...options, headers });    };

        

    if (response.status === 401) {    const response = await fetch(url, { ...options, headers });

      setShowApiKeyPrompt(true);    

      localStorage.removeItem('apiKey');    if (response.status === 401) {

      throw new Error('Unauthorized - Invalid API key');      setShowApiKeyPrompt(true);

    }      localStorage.removeItem('apiKey');

          throw new Error('Unauthorized - Invalid API key');

    return response;    }

  };    

    return response;

  const handleApiKeySubmit = (e) => {  };

    e.preventDefault();

    const key = e.target.apikey.value.trim();  const handleApiKeySubmit = (e) => {

    if (key) {    e.preventDefault();

      localStorage.setItem('apiKey', key);    const key = e.target.apikey.value.trim();

      setApiKey(key);    if (key) {

      setShowApiKeyPrompt(false);      localStorage.setItem('apiKey', key);

    }      setApiKey(key);

  };      setShowApiKeyPrompt(false);

    }

  const handleLogout = () => {  };

    if (window.confirm('Clear API key and logout?')) {

      localStorage.removeItem('apiKey');  const handleLogout = () => {

      setApiKey('');    if (window.confirm('Clear API key and logout?')) {

      setShowApiKeyPrompt(true);      localStorage.removeItem('apiKey');

    }      setApiKey('');

  };      setShowApiKeyPrompt(true);

    }

  React.useEffect(() => {  };

    if (apiKey && !showApiKeyPrompt) {

      fetchStats();  React.useEffect(() => {

      fetchTemplates();    if (apiKey && !showApiKeyPrompt) {

      fetchContainers();      fetchStats();

      fetchBackups();      fetchTemplates();

    }      fetchContainers();

  }, [apiKey, showApiKeyPrompt]);      fetchBackups();

    }

  const fetchStats = async () => {  }, [apiKey, showApiKeyPrompt]);

    try {

      const response = await fetchWithAuth(`${API_URL}/api/stats`);  const fetchStats = async () => {

      const data = await response.json();    try {

      setStats(data);      const response = await fetchWithAuth(`${API_URL}/api/stats`);

    } catch (error) {      const data = await response.json();

      console.error('Error fetching stats:', error);      setStats(data);

    }    } catch (error) {

  };      console.error('Error fetching stats:', error);

    }

  const fetchTemplates = async () => {  };

    setLoading(true);

    try {  const fetchTemplates = async () => {

      const response = await fetchWithAuth(`${API_URL}/api/templates`);    setLoading(true);

      const data = await response.json();    try {

      setTemplates(data);      const response = await fetchWithAuth(`${API_URL}/api/templates`);

    } catch (error) {      const data = await response.json();

      console.error('Error fetching templates:', error);      setTemplates(data);

    }    } catch (error) {

    setLoading(false);      console.error('Error fetching templates:', error);

  };    }

    setLoading(false);

  const fetchContainers = async () => {  };

    try {

      const response = await fetchWithAuth(`${API_URL}/api/containers`);  const fetchContainers = async () => {

      const data = await response.json();    try {

      setContainers(data);      const response = await fetchWithAuth(`${API_URL}/api/containers`);

    } catch (error) {      const data = await response.json();

      console.error('Error fetching containers:', error);      setContainers(data);

    }    } catch (error) {

  };      console.error('Error fetching containers:', error);

    }

  const fetchBackups = async () => {  };

    try {

      const response = await fetchWithAuth(`${API_URL}/api/backups`);  const fetchBackups = async () => {

      const data = await response.json();    try {

      setBackups(data);      const response = await fetchWithAuth(`${API_URL}/api/backups`);

    } catch (error) {      const data = await response.json();

      console.error('Error fetching backups:', error);      setBackups(data);

    }    } catch (error) {

  };      console.error('Error fetching backups:', error);

    }

  const handleDeleteTemplate = async (filename) => {  };

    if (!window.confirm(`Are you sure you want to delete ${filename}?`)) {

      return;  const handleDeleteTemplate = async (filename) => {

    }    if (!window.confirm(`Are you sure you want to delete ${filename}?`)) {

      return;

    try {    }

      const response = await fetchWithAuth(`${API_URL}/api/templates/${filename}`, {

        method: 'DELETE'    try {

      });      const response = await fetchWithAuth(`${API_URL}/api/templates/${filename}`, {

              method: 'DELETE'

      if (response.ok) {      });

        alert('Template deleted successfully');      

        fetchTemplates();      if (response.ok) {

        fetchStats();        alert('Template deleted successfully');

      } else {        fetchTemplates();

        alert('Error deleting template');        fetchStats();

      }      } else {

    } catch (error) {        alert('Error deleting template');

      console.error('Error deleting template:', error);      }

      alert('Error deleting template');    } catch (error) {

    }      console.error('Error deleting template:', error);

  };      alert('Error deleting template');

    }

  const handleCloneTemplate = async (filename) => {  };

    const baseName = filename.replace('.xml', '');

    const defaultName = `${baseName}-copy`;  const handleCloneTemplate = async (filename) => {

        const baseName = filename.replace('.xml', '');

    const newName = prompt(`Clone "${filename}" as:`, defaultName);    const defaultName = `${baseName}-copy`;

        

    if (!newName) return; // Cancelled    const newName = prompt(`Clone "${filename}" as:`, defaultName);

        

    const trimmedName = newName.trim();    if (!newName) return; // Cancelled

    if (!trimmedName) {    

      alert('Template name cannot be empty');    const trimmedName = newName.trim();

      return;    if (!trimmedName) {

    }      alert('Template name cannot be empty');

          return;

    setLoading(true);    }

    try {    

      const response = await fetchWithAuth(`${API_URL}/api/templates/${filename}/clone`, {    setLoading(true);

        method: 'POST',    try {

        body: JSON.stringify({ new_name: trimmedName })      const response = await fetchWithAuth(`${API_URL}/api/templates/${filename}/clone`, {

      });        method: 'POST',

              body: JSON.stringify({ new_name: trimmedName })

      const data = await response.json();      });

            

      if (response.ok) {      const data = await response.json();

        alert(data.message || `Template cloned as ${data.filename}`);      

        fetchTemplates();      if (response.ok) {

        fetchStats();        alert(data.message || `Template cloned as ${data.filename}`);

      } else {        fetchTemplates();

        alert(data.error || 'Failed to clone template');        fetchStats();

      }      } else {

    } catch (error) {        alert(data.error || 'Failed to clone template');

      console.error('Error cloning template:', error);      }

      alert('Error cloning template');    } catch (error) {

    }      console.error('Error cloning template:', error);

    setLoading(false);      alert('Error cloning template');

  };    }

    setLoading(false);

  const handleViewTemplate = async (filename) => {  };

    setLoading(true);

    try {  const handleViewTemplate = async (filename) => {

      const response = await fetchWithAuth(`${API_URL}/api/templates/${filename}`);    setLoading(true);

      const data = await response.json();    try {

            const response = await fetchWithAuth(`${API_URL}/api/templates/${filename}`);

      if (response.ok) {      const data = await response.json();

        setEditingTemplate(filename);      

        setEditContent(data.content);      if (response.ok) {

      } else {        setEditingTemplate(filename);

        alert('Failed to load template');        setEditContent(data.content);

      }      } else {

    } catch (error) {        alert('Failed to load template');

      console.error('Error loading template:', error);      }

      alert('Error loading template');    } catch (error) {

    }      console.error('Error loading template:', error);

    setLoading(false);      alert('Error loading template');

  };    }

    setLoading(false);

  const handleSaveTemplate = async () => {  };

    if (!editingTemplate) return;

      const handleSaveTemplate = async () => {

    setLoading(true);    if (!editingTemplate) return;

    try {    

      const response = await fetchWithAuth(`${API_URL}/api/templates/${editingTemplate}/edit`, {    setLoading(true);

        method: 'PUT',    try {

        body: JSON.stringify({ content: editContent })      const response = await fetchWithAuth(`${API_URL}/api/templates/${editingTemplate}/edit`, {

      });        method: 'PUT',

              body: JSON.stringify({ content: editContent })

      const data = await response.json();      });

            

      if (response.ok) {      const data = await response.json();

        alert(data.message || 'Template saved successfully');      

        setEditingTemplate(null);      if (response.ok) {

        setEditContent('');        alert(data.message || 'Template saved successfully');

        fetchTemplates();        setEditingTemplate(null);

      } else {        setEditContent('');

        alert(data.error || 'Failed to save template');        fetchTemplates();

      }      } else {

    } catch (error) {        alert(data.error || 'Failed to save template');

      console.error('Error saving template:', error);      }

      alert('Error saving template');    } catch (error) {

    }      console.error('Error saving template:', error);

    setLoading(false);      alert('Error saving template');

  };    }

    setLoading(false);

  const handleCloseEditor = () => {  };

    if (editContent && window.confirm('You have unsaved changes. Close anyway?')) {

      setEditingTemplate(null);  const handleCloseEditor = () => {

      setEditContent('');    if (editContent && window.confirm('You have unsaved changes. Close anyway?')) {

    } else if (!editContent) {      setEditingTemplate(null);

      setEditingTemplate(null);      setEditContent('');

      setEditContent('');    } else if (!editContent) {

    }      setEditingTemplate(null);

  };      setEditContent('');

    }

  const handleRenameTemplate = (filename) => {  };

    const baseName = filename.replace('.xml', '');

    setRenamingTemplate(filename);  const handleRenameTemplate = (filename) => {

    setNewTemplateName(baseName);    const baseName = filename.replace('.xml', '');

  };    setRenamingTemplate(filename);

    setNewTemplateName(baseName);

  const handleSaveRename = async () => {  };

    if (!renamingTemplate || !newTemplateName.trim()) return;

      const handleSaveRename = async () => {

    setLoading(true);    if (!renamingTemplate || !newTemplateName.trim()) return;

    try {    

      const response = await fetchWithAuth(`${API_URL}/api/templates/${renamingTemplate}/rename`, {    setLoading(true);

        method: 'PATCH',    try {

        body: JSON.stringify({ new_name: newTemplateName.trim() })      const response = await fetchWithAuth(`${API_URL}/api/templates/${renamingTemplate}/rename`, {

      });        method: 'PATCH',

              body: JSON.stringify({ new_name: newTemplateName.trim() })

      const data = await response.json();      });

            

      if (response.ok) {      const data = await response.json();

        alert(data.message || 'Template renamed successfully');      

        setRenamingTemplate(null);      if (response.ok) {

        setNewTemplateName('');        alert(data.message || 'Template renamed successfully');

        fetchTemplates();        setRenamingTemplate(null);

        fetchStats();        setNewTemplateName('');

      } else {        fetchTemplates();

        alert(data.error || 'Failed to rename template');        fetchStats();

      }      } else {

    } catch (error) {        alert(data.error || 'Failed to rename template');

      console.error('Error renaming template:', error);      }

      alert('Error renaming template');    } catch (error) {

    }      console.error('Error renaming template:', error);

    setLoading(false);      alert('Error renaming template');

  };    }

    setLoading(false);

  const handleContainerAction = async (containerName, action) => {  };

    setLoading(true);

    try {  const handleContainerAction = async (containerName, action) => {

      const response = await fetchWithAuth(`${API_URL}/api/containers/${containerName}/${action}`, {    setLoading(true);

        method: 'POST'    try {

      });      const response = await fetchWithAuth(`${API_URL}/api/containers/${containerName}/${action}`, {

              method: 'POST'

      const data = await response.json();      });

            

      if (response.ok) {      const data = await response.json();

        alert(data.message || `Container ${action}ed successfully`);      

        fetchContainers();      if (response.ok) {

      } else {        alert(data.message || `Container ${action}ed successfully`);

        alert(data.error || `Failed to ${action} container`);        fetchContainers();

      }      } else {

    } catch (error) {        alert(data.error || `Failed to ${action} container`);

      console.error(`Error ${action}ing container:`, error);      }

      alert(`Error ${action}ing container`);    } catch (error) {

    }      console.error(`Error ${action}ing container:`, error);

    setLoading(false);      alert(`Error ${action}ing container`);

  };    }

    setLoading(false);

  const getPageTitle = () => {  };

    const titles = {

      'dashboard': 'Dashboard',  const getPageTitle = () => {

      'templates': `Templates (${getFilteredAndSortedTemplates().length}/${templates.length})`,    const titles = {

      'containers': `Containers (${containers.length})`,      'dashboard': 'Dashboard',

      'backups': `Backups (${backups.length})`      'templates': `Templates (${getFilteredAndSortedTemplates().length}/${templates.length})`,

    };      'containers': `Containers (${containers.length})`,

    return titles[activeTab] || 'Dashboard';      'backups': `Backups (${backups.length})`

  };    };

    return titles[activeTab] || 'Dashboard';

  const handleCleanupTemplates = async (dryRun = true) => {  };

    setLoading(true);

    try {  const handleCleanupTemplates = async (dryRun = true) => {

      const response = await fetchWithAuth(`${API_URL}/api/templates/cleanup`, {    setLoading(true);

        method: 'POST',    try {

        body: JSON.stringify({ dry_run: dryRun })      const response = await fetchWithAuth(`${API_URL}/api/templates/cleanup`, {

      });        method: 'POST',

              body: JSON.stringify({ dry_run: dryRun })

      const data = await response.json();      });

            

      if (dryRun) {      const data = await response.json();

        const unusedCount = data.unused_templates.length;      

        if (unusedCount > 0) {      if (dryRun) {

          if (window.confirm(`Found ${unusedCount} unused templates. Delete them?`)) {        const unusedCount = data.unused_templates.length;

            handleCleanupTemplates(false);        if (unusedCount > 0) {

          }          if (window.confirm(`Found ${unusedCount} unused templates. Delete them?`)) {

        } else {            handleCleanupTemplates(false);

          alert('No unused templates found!');          }

        }        } else {

      } else {          alert('No unused templates found!');

        alert(`Deleted ${data.count} unused templates`);        }

        fetchTemplates();      } else {

        fetchStats();        alert(`Deleted ${data.count} unused templates`);

      }        fetchTemplates();

    } catch (error) {        fetchStats();

      console.error('Error cleaning up templates:', error);      }

      alert('Error cleaning up templates');    } catch (error) {

    }      console.error('Error cleaning up templates:', error);

    setLoading(false);      alert('Error cleaning up templates');

  };    }

    setLoading(false);

  const handleCreateBackup = async () => {  };

    setLoading(true);

    try {  const handleCreateBackup = async () => {

      const response = await fetchWithAuth(`${API_URL}/api/backups`, {    setLoading(true);

        method: 'POST',    try {

        body: JSON.stringify({})      const response = await fetchWithAuth(`${API_URL}/api/backups`, {

      });        method: 'POST',

              body: JSON.stringify({})

      const data = await response.json();      });

      if (data.success) {      

        alert(`Backup created: ${data.backup_name}`);      const data = await response.json();

        fetchBackups();      if (data.success) {

      }        alert(`Backup created: ${data.backup_name}`);

    } catch (error) {        fetchBackups();

      console.error('Error creating backup:', error);      }

      alert('Error creating backup');    } catch (error) {

    }      console.error('Error creating backup:', error);

    setLoading(false);      alert('Error creating backup');

  };    }

    setLoading(false);

  const handleDeleteBackup = async (backupName) => {  };

    if (!window.confirm(`Delete backup ${backupName}?`)) {

      return;  const handleDeleteBackup = async (backupName) => {

    }    if (!window.confirm(`Delete backup ${backupName}?`)) {

      return;

    try {    }

      const response = await fetchWithAuth(`${API_URL}/api/backups/${backupName}`, {

        method: 'DELETE'    try {

      });      const response = await fetchWithAuth(`${API_URL}/api/backups/${backupName}`, {

              method: 'DELETE'

      if (response.ok) {      });

        alert('Backup deleted');      

        fetchBackups();      if (response.ok) {

      }        alert('Backup deleted');

    } catch (error) {        fetchBackups();

      console.error('Error deleting backup:', error);      }

      alert('Error deleting backup');    } catch (error) {

    }      console.error('Error deleting backup:', error);

  };      alert('Error deleting backup');

    }

  const handleRestoreBackup = async (backupName) => {  };

    if (!window.confirm(`Restore templates from backup ${backupName}? This will copy all templates from the backup to your templates directory. Existing templates with the same name will be overwritten.`)) {

      return;  const handleRestoreBackup = async (backupName) => {

    }    if (!window.confirm(`Restore templates from backup ${backupName}? This will copy all templates from the backup to your templates directory. Existing templates with the same name will be overwritten.`)) {

      return;

    setLoading(true);    }

    try {

      const response = await fetchWithAuth(`${API_URL}/api/backups/${backupName}/restore`, {    setLoading(true);

        method: 'POST'    try {

      });      const response = await fetchWithAuth(`${API_URL}/api/backups/${backupName}/restore`, {

              method: 'POST'

      const data = await response.json();      });

            

      if (response.ok) {      const data = await response.json();

        alert(data.message || 'Backup restored successfully');      

        fetchTemplates();      if (response.ok) {

        fetchStats();        alert(data.message || 'Backup restored successfully');

      } else {        fetchTemplates();

        alert(data.error || 'Error restoring backup');        fetchStats();

      }      } else {

    } catch (error) {        alert(data.error || 'Error restoring backup');

      console.error('Error restoring backup:', error);      }

      alert('Error restoring backup');    } catch (error) {

    }      console.error('Error restoring backup:', error);

    setLoading(false);      alert('Error restoring backup');

  };    }

    setLoading(false);

  const formatBytes = (bytes) => {  };

    if (bytes === 0) return '0 Bytes';

    const k = 1024;  const formatBytes = (bytes) => {

    const sizes = ['Bytes', 'KB', 'MB', 'GB'];    if (bytes === 0) return '0 Bytes';

    const i = Math.floor(Math.log(bytes) / Math.log(k));    const k = 1024;

    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];    const sizes = ['Bytes', 'KB', 'MB', 'GB'];

  };    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];

  const formatDate = (isoString) => {  };

    return new Date(isoString).toLocaleString();

  };  const formatDate = (isoString) => {

    return new Date(isoString).toLocaleString();

  const toggleTemplateSelection = (filename) => {  };

    setSelectedTemplates(prev => 

      prev.includes(filename)   const toggleTemplateSelection = (filename) => {

        ? prev.filter(f => f !== filename)    setSelectedTemplates(prev => 

        : [...prev, filename]      prev.includes(filename) 

    );        ? prev.filter(f => f !== filename)

  };        : [...prev, filename]

    );

  const toggleContainerSelection = (containerName) => {  };

    setSelectedContainers(prev => 

      prev.includes(containerName)   const toggleContainerSelection = (containerName) => {

        ? prev.filter(c => c !== containerName)    setSelectedContainers(prev => 

        : [...prev, containerName]      prev.includes(containerName) 

    );        ? prev.filter(c => c !== containerName)

  };        : [...prev, containerName]

    );

  const handleDeleteSelected = async () => {  };

    if (selectedTemplates.length === 0) {

      alert('No templates selected');  const handleDeleteSelected = async () => {

      return;    if (selectedTemplates.length === 0) {

    }      alert('No templates selected');

      return;

    if (!window.confirm(`Delete ${selectedTemplates.length} selected templates?`)) {    }

      return;

    }    if (!window.confirm(`Delete ${selectedTemplates.length} selected templates?`)) {

      return;

    setLoading(true);    }

    for (const filename of selectedTemplates) {

      try {    setLoading(true);

        await fetchWithAuth(`${API_URL}/api/templates/${filename}`, { method: 'DELETE' });    for (const filename of selectedTemplates) {

      } catch (error) {      try {

        console.error(`Error deleting ${filename}:`, error);        await fetchWithAuth(`${API_URL}/api/templates/${filename}`, { method: 'DELETE' });

      }      } catch (error) {

    }        console.error(`Error deleting ${filename}:`, error);

    setSelectedTemplates([]);      }

    fetchTemplates();    }

    fetchStats();    setSelectedTemplates([]);

    setLoading(false);    fetchTemplates();

  };    fetchStats();

    setLoading(false);

  const handleBulkContainerAction = async (action) => {  };

    if (selectedContainers.length === 0) {

      alert('No containers selected');  const handleBulkContainerAction = async (action) => {

      return;    if (selectedContainers.length === 0) {

    }      alert('No containers selected');

      return;

    const actionText = action === 'stop' ? 'stop' : action === 'start' ? 'start' : 'restart';    }

    if (!window.confirm(`${actionText.charAt(0).toUpperCase() + actionText.slice(1)} ${selectedContainers.length} selected container(s)?`)) {

      return;    const actionText = action === 'stop' ? 'stop' : action === 'start' ? 'start' : 'restart';

    }    if (!window.confirm(`${actionText.charAt(0).toUpperCase() + actionText.slice(1)} ${selectedContainers.length} selected container(s)?`)) {

      return;

    setLoading(true);    }

    try {

      for (const containerName of selectedContainers) {    setLoading(true);

        await fetchWithAuth(`${API_URL}/api/containers/${containerName}/${action}`, {    try {

          method: 'POST'      for (const containerName of selectedContainers) {

        });        await fetchWithAuth(`${API_URL}/api/containers/${containerName}/${action}`, {

      }          method: 'POST'

      setSelectedContainers([]);        });

      fetchContainers();      }

      alert(`Containers ${actionText}ed successfully`);      setSelectedContainers([]);

    } catch (error) {      fetchContainers();

      console.error(`Error ${actionText}ing containers:`, error);      alert(`Containers ${actionText}ed successfully`);

      alert(`Error ${actionText}ing containers`);    } catch (error) {

    }      console.error(`Error ${actionText}ing containers:`, error);

    setLoading(false);      alert(`Error ${actionText}ing containers`);

  };    }

    setLoading(false);

  // Filter and sort templates  };

  const getFilteredAndSortedTemplates = () => {

    let filtered = templates;  // Filter and sort templates

  const getFilteredAndSortedTemplates = () => {

    // Apply search filter    let filtered = templates;

    if (searchTerm) {

      filtered = filtered.filter(t =>     // Apply search filter

        t.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||    if (searchTerm) {

        (t.container && t.container.name.toLowerCase().includes(searchTerm.toLowerCase()))      filtered = filtered.filter(t => 

      );        t.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||

    }        (t.container && t.container.name.toLowerCase().includes(searchTerm.toLowerCase()))

      );

    // Apply status filter    }

    if (filterStatus === 'matched') {

      filtered = filtered.filter(t => t.matched);    // Apply status filter

    } else if (filterStatus === 'unmatched') {    if (filterStatus === 'matched') {

      filtered = filtered.filter(t => !t.matched);      filtered = filtered.filter(t => t.matched);

    }    } else if (filterStatus === 'unmatched') {

      filtered = filtered.filter(t => !t.matched);

    // Apply sorting    }

    filtered.sort((a, b) => {

      if (sortBy === 'name') {    // Apply sorting

        return a.filename.localeCompare(b.filename);    filtered.sort((a, b) => {

      } else if (sortBy === 'size') {      if (sortBy === 'name') {

        return b.size - a.size;        return a.filename.localeCompare(b.filename);

      } else if (sortBy === 'date') {      } else if (sortBy === 'size') {

        return new Date(b.modified) - new Date(a.modified);        return b.size - a.size;

      }      } else if (sortBy === 'date') {

      return 0;        return new Date(b.modified) - new Date(a.modified);

    });      }

      return 0;

    return filtered;    });

  };

    return filtered;

  // Render the component  };

  return React.createElement('div', { className: 'app-container' },

    // API Key Prompt Modal  // Create base elements

    showApiKeyPrompt && React.createElement('div', { className: 'modal-overlay' },  const modals = [

      React.createElement('div', { className: 'modal' },    showApiKeyPrompt && React.createElement('div', { key: 'api-modal', className: 'modal-overlay' },

        React.createElement('h2', null, '🔑 API Key Required'),      React.createElement('div', { className: 'modal' },

        React.createElement('p', null, 'Enter your API key to access Docker Template Manager.'),        React.createElement('h2', null, '🔑 API Key Required'),

        React.createElement('p', { className: 'text-small text-muted' },         React.createElement('p', null, 'Enter your API key to access Docker Template Manager.'),

          'Find your API key in Docker logs: Docker tab → Container icon → Logs'),        React.createElement('p', { className: 'text-small text-muted' }, 

        React.createElement('form', { onSubmit: handleApiKeySubmit },          'Find your API key in Docker logs: Docker tab → Container icon → Logs'),

          React.createElement('input', {        React.createElement('form', { onSubmit: handleApiKeySubmit },

            type: 'password',          React.createElement('input', {

            name: 'apikey',            type: 'password',

            placeholder: 'Enter API key',            name: 'apikey',

            autoFocus: true,            placeholder: 'Enter API key',

            required: true,            autoFocus: true,

            style: { width: '100%', padding: '10px', marginBottom: '10px', fontSize: '14px' }            required: true,

          }),            style: { width: '100%', padding: '10px', marginBottom: '10px', fontSize: '14px' }

          React.createElement('button', { type: 'submit', className: 'btn-primary' }, 'Submit')          }),

        )          React.createElement('button', { type: 'submit', className: 'btn-primary' }, 'Submit')

      )        )

    ),      )

    )

    // Template Editor Modal  ].filter(Boolean);

    editingTemplate && React.createElement('div', { className: 'modal-overlay' },

      React.createElement('div', { className: 'modal modal-large' },  // Main app structure

        React.createElement('div', { className: 'modal-header' },  const container = React.createElement('div', { className: 'app-container' },

          React.createElement('h2', null, `✏️ Edit: ${editingTemplate}`),    // API Key Prompt Modal

          React.createElement('button', {    showApiKeyPrompt && React.createElement('div', { className: 'modal-overlay' },

            className: 'close-button',      React.createElement('div', { className: 'modal' },

            onClick: handleCloseEditor        React.createElement('h2', null, '🔑 API Key Required'),

          }, '✕')        React.createElement('p', null, 'Enter your API key to access Docker Template Manager.'),

        ),        React.createElement('p', { className: 'text-small text-muted' }, 

        React.createElement('div', { className: 'modal-body' },          'Find your API key in Docker logs: Docker tab → Container icon → Logs'),

          React.createElement('textarea', {        React.createElement('form', { onSubmit: handleApiKeySubmit },

            className: 'code-editor',          React.createElement('input', {

            value: editContent,            type: 'password',

            onChange: (e) => setEditContent(e.target.value),            name: 'apikey',

            spellCheck: false,            placeholder: 'Enter API key',

            rows: 20            autoFocus: true,

          })            required: true,

        ),            style: { width: '100%', padding: '10px', marginBottom: '10px', fontSize: '14px' }

        React.createElement('div', { className: 'modal-footer' },          }),

          React.createElement('button', {          React.createElement('button', { type: 'submit', className: 'btn-primary' }, 'Submit')

            className: 'btn-secondary',        )

            onClick: handleCloseEditor      )

          }, 'Cancel'),    ),

          React.createElement('button', {    // Template Editor Modal

            className: 'btn-primary',    editingTemplate && React.createElement('div', { className: 'modal-overlay' },

            onClick: handleSaveTemplate,      React.createElement('div', { className: 'modal modal-large' },

            disabled: loading        React.createElement('div', { className: 'modal-header' },

          }, loading ? 'Saving...' : 'Save Changes')          React.createElement('h2', null, `✏️ Edit: ${editingTemplate}`),

        )          React.createElement('button', {

      )            className: 'close-button',

    ),            onClick: handleCloseEditor

          }, '✕')

    // Rename Template Modal        ),

    renamingTemplate && React.createElement('div', { className: 'modal-overlay' },        React.createElement('div', { className: 'modal-body' },

      React.createElement('div', { className: 'modal' },          React.createElement('textarea', {

        React.createElement('h2', null, '✏️ Rename Template'),            className: 'code-editor',

        React.createElement('p', null, `Renaming: ${renamingTemplate}`),            value: editContent,

        React.createElement('div', { style: { marginBottom: '15px' } },            onChange: (e) => setEditContent(e.target.value),

          React.createElement('label', { style: { display: 'block', marginBottom: '5px', color: 'var(--unraid-text-secondary)' } }, 'New name:'),            spellCheck: false,

          React.createElement('input', {            rows: 20

            type: 'text',          })

            value: newTemplateName,        ),

            onChange: (e) => setNewTemplateName(e.target.value),        React.createElement('div', { className: 'modal-footer' },

            placeholder: 'template-name',          React.createElement('button', {

            style: { width: '100%', padding: '10px', fontSize: '14px' },            className: 'btn-secondary',

            autoFocus: true            onClick: handleCloseEditor

          })          }, 'Cancel'),

        ),          React.createElement('button', {

        React.createElement('div', { className: 'modal-footer' },            className: 'btn-primary',

          React.createElement('button', {            onClick: handleSaveTemplate,

            className: 'btn-secondary',            disabled: loading

            onClick: () => {          }, loading ? 'Saving...' : 'Save Changes')

              setRenamingTemplate(null);        )

              setNewTemplateName('');      )

            }    ),

          }, 'Cancel'),    // Rename Template Modal

          React.createElement('button', {    renamingTemplate && React.createElement('div', { className: 'modal-overlay' },

            className: 'btn-primary',      React.createElement('div', { className: 'modal' },

            onClick: handleSaveRename,        React.createElement('h2', null, '✏️ Rename Template'),

            disabled: loading || !newTemplateName.trim()        React.createElement('p', null, `Renaming: ${renamingTemplate}`),

          }, loading ? 'Renaming...' : 'Rename')        React.createElement('div', { style: { marginBottom: '15px' } },

        )          React.createElement('label', { style: { display: 'block', marginBottom: '5px', color: 'var(--unraid-text-secondary)' } }, 'New name:'),

      )          React.createElement('input', {

    ),            type: 'text',

            value: newTemplateName,

    // Main App Structure            onChange: (e) => setNewTemplateName(e.target.value),

    !showApiKeyPrompt && React.createElement(React.Fragment, null,            placeholder: 'template-name',

      // Sidebar Navigation            style: { width: '100%', padding: '10px', fontSize: '14px' },

      React.createElement('aside', {             autoFocus: true

        className: `sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`          })

      },        ),

        // Sidebar Header        React.createElement('div', { className: 'modal-footer' },

        React.createElement('div', { className: 'sidebar-header' },          React.createElement('button', {

          React.createElement('div', { className: 'sidebar-logo' },             className: 'btn-secondary',

            React.createElement('img', {             onClick: () => {

              src: '/static/png/logo.png',               setRenamingTemplate(null);

              alt: 'Docker Template Manager',              setNewTemplateName('');

              style: {             }

                width: '40px',           }, 'Cancel'),

                height: '40px',          React.createElement('button', {

                objectFit: 'contain',            className: 'btn-primary',

                display: 'block'            onClick: handleSaveRename,

              }            disabled: loading || !newTemplateName.trim()

            })          }, loading ? 'Renaming...' : 'Rename')

          )        )

        ),      )

        // Navigation Items    ),

        React.createElement('nav', { className: 'sidebar-nav' },    // Sidebar Navigation

          React.createElement('div', {    !showApiKeyPrompt && React.createElement('aside', { 

            className: `nav-item ${activeTab === 'dashboard' ? 'active' : ''}`,      className: `sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`

            onClick: () => { setActiveTab('dashboard'); setMobileMenuOpen(false); }    },

          },      // Sidebar Header

            React.createElement('i', { className: 'fas fa-tachometer-alt nav-icon' }),      React.createElement('div', { className: 'sidebar-header' },

            React.createElement('span', null, 'Dashboard')        React.createElement('div', { className: 'sidebar-logo' }, 

          ),          React.createElement('img', { 

          React.createElement('div', {            src: '/static/png/logo.png', 

            className: `nav-item ${activeTab === 'templates' ? 'active' : ''}`,            alt: 'Docker Template Manager',

            onClick: () => { setActiveTab('templates'); setMobileMenuOpen(false); }            style: { 

          },              width: '40px', 

            React.createElement('i', { className: 'fas fa-file-alt nav-icon' }),              height: '40px',

            React.createElement('span', null, 'Templates')              objectFit: 'contain',

          ),              display: 'block'

          React.createElement('div', {            }

            className: `nav-item ${activeTab === 'containers' ? 'active' : ''}`,          })

            onClick: () => { setActiveTab('containers'); setMobileMenuOpen(false); }        )

          },      ),

            React.createElement('i', { className: 'fab fa-docker nav-icon' }),      // Sidebar Navigation

            React.createElement('span', null, 'Containers')      React.createElement('nav', { className: 'sidebar-nav' },

          ),        React.createElement('div', {

          React.createElement('div', {          className: `nav-item ${activeTab === 'dashboard' ? 'active' : ''}`,

            className: `nav-item ${activeTab === 'backups' ? 'active' : ''}`,          onClick: () => { setActiveTab('dashboard'); setMobileMenuOpen(false); }

            onClick: () => { setActiveTab('backups'); setMobileMenuOpen(false); }        },

          },          React.createElement('i', { className: 'fas fa-tachometer-alt nav-icon' }),

            React.createElement('i', { className: 'fas fa-cloud-upload-alt nav-icon' }),          React.createElement('span', null, 'Dashboard')

            React.createElement('span', null, 'Backups')        ),

          )        React.createElement('div', {

        ),          className: `nav-item ${activeTab === 'templates' ? 'active' : ''}`,

        // Sidebar Footer          onClick: () => { setActiveTab('templates'); setMobileMenuOpen(false); }

        React.createElement('div', { className: 'sidebar-footer' },        },

          React.createElement('div', { className: 'theme-toggle', onClick: toggleTheme },          React.createElement('i', { className: 'fas fa-file-alt nav-icon' }),

            React.createElement('span', { className: 'theme-label' },          React.createElement('span', null, 'Templates')

              React.createElement('i', { className: `lni ${theme === 'dark' ? 'lni-moon' : 'lni-sun'} theme-icon` }),        ),

              React.createElement('span', null, theme === 'dark' ? 'Dark' : 'Light')        React.createElement('div', {

            ),          className: `nav-item ${activeTab === 'containers' ? 'active' : ''}`,

            React.createElement('div', { className: `theme-switch ${theme === 'dark' ? 'active' : ''}` },          onClick: () => { setActiveTab('containers'); setMobileMenuOpen(false); }

              React.createElement('div', { className: 'theme-switch-thumb' })        },

            )          React.createElement('i', { className: 'fab fa-docker nav-icon' }),

          ),          React.createElement('span', null, 'Containers')

          React.createElement('button', {        ),

            onClick: handleLogout,        React.createElement('div', {

            style: {           className: `nav-item ${activeTab === 'backups' ? 'active' : ''}`,

              width: '100%',           onClick: () => { setActiveTab('backups'); setMobileMenuOpen(false); }

              marginTop: '10px',         },

              padding: '10px',           React.createElement('i', { className: 'fas fa-cloud-upload-alt nav-icon' }),

              background: 'var(--unraid-bg-tertiary)',          React.createElement('span', null, 'Backups')

              border: '1px solid var(--unraid-border)',        )

              borderRadius: '6px',      ),

              color: 'var(--unraid-text-secondary)',      // Sidebar Footer

              cursor: 'pointer',      React.createElement('div', { className: 'sidebar-footer' },

              fontSize: '13px'        React.createElement('div', { className: 'theme-toggle', onClick: toggleTheme },

            }          React.createElement('span', { className: 'theme-label' },

          },             React.createElement('i', { className: `lni ${theme === 'dark' ? 'lni-moon' : 'lni-sun'} theme-icon` }),

            React.createElement('i', { className: 'lni lni-exit' }),            React.createElement('span', null, theme === 'dark' ? 'Dark' : 'Light')

            React.createElement('span', { style: { marginLeft: '6px' } }, 'Logout')          ),

          )          React.createElement('div', { className: `theme-switch ${theme === 'dark' ? 'active' : ''}` },

        )            React.createElement('div', { className: 'theme-switch-thumb' })

      ),          )

        ),

      // Mobile Overlay        React.createElement('button', {

      mobileMenuOpen && React.createElement('div', {          onClick: handleLogout,

        className: 'sidebar-overlay active',          style: { 

        onClick: () => setMobileMenuOpen(false)            width: '100%', 

      }),            marginTop: '10px', 

            padding: '10px', 

      // Main Content Area            background: 'var(--unraid-bg-tertiary)',

      React.createElement('main', { className: 'main-content' },            border: '1px solid var(--unraid-border)',

        // Top Bar            borderRadius: '6px',

        React.createElement('div', { key: 'top-bar', className: 'top-bar' },            color: 'var(--unraid-text-secondary)',

          React.createElement('div', { className: 'top-bar-title' },            cursor: 'pointer',

            React.createElement('div', { className: 'breadcrumb' },            fontSize: '13px'

              React.createElement('span', { className: 'breadcrumb-item' }, 'Docker Template Manager'),          }

              React.createElement('span', { className: 'breadcrumb-separator' }, '›'),        }, 

              React.createElement('span', { className: 'breadcrumb-current' }, getPageTitle())          React.createElement('i', { className: 'lni lni-exit' }),

            )          React.createElement('span', { style: { marginLeft: '6px' } }, 'Logout')

          ),        )

          React.createElement('div', { className: 'top-bar-actions' },      )

            activeTab === 'templates' && React.createElement('button', {    ),

              className: 'top-bar-button primary',    // Mobile Overlay

              onClick: () => handleCleanupTemplates(true),    !showApiKeyPrompt && mobileMenuOpen && React.createElement('div', {

              disabled: loading      className: 'sidebar-overlay active',

            },       onClick: () => setMobileMenuOpen(false)

              React.createElement('i', { className: 'lni lni-broom' }),    }),

              React.createElement('span', { style: { marginLeft: '4px' } }, 'Cleanup')    // Main Content

            ),    !showApiKeyPrompt && React.createElement('main', { className: 'main-content' },

            activeTab === 'backups' && React.createElement('button', {      // Top Bar

              className: 'top-bar-button primary',      React.createElement('div', { key: 'top-bar', className: 'top-bar' },

              onClick: handleCreateBackup,        React.createElement('div', { className: 'top-bar-title' },

              disabled: loading          React.createElement('div', { className: 'breadcrumb' },

            },             React.createElement('span', { className: 'breadcrumb-item' }, 'Docker Template Manager'),

              React.createElement('i', { className: 'lni lni-cloud-upload' }),            React.createElement('span', { className: 'breadcrumb-separator' }, '›'),

              React.createElement('span', { style: { marginLeft: '4px' } }, 'Create Backup')            React.createElement('span', { className: 'breadcrumb-current' }, getPageTitle())

            )          )

          )        ),

        ),        React.createElement('div', { className: 'top-bar-actions' },

          activeTab === 'templates' && React.createElement('button', {

        // Content Area            className: 'top-bar-button primary',

        React.createElement('div', { className: 'content-wrapper' },            onClick: () => handleCleanupTemplates(true),

          // Render content based on active tab            disabled: loading

          activeTab === 'dashboard' && stats && React.createElement('div', { className: 'dashboard' },          }, 

            React.createElement('div', { className: 'stats-grid' },            React.createElement('i', { className: 'lni lni-broom' }),

              React.createElement('div', { className: 'stat-card' },            React.createElement('span', { style: { marginLeft: '4px' } }, 'Cleanup')

                React.createElement('h3', null, 'Templates'),          ),

                React.createElement('div', { className: 'stat-value' }, stats.total_templates),          activeTab === 'backups' && React.createElement('button', {

                React.createElement('div', { className: 'stat-detail' },             className: 'top-bar-button primary',

                  `${stats.matched_templates} matched, ${stats.unmatched_templates} unused`)            onClick: handleCreateBackup,

              ),            disabled: loading

              React.createElement('div', { className: 'stat-card' },          }, 

                React.createElement('h3', null, 'Containers'),            React.createElement('i', { className: 'lni lni-cloud-upload' }),

                React.createElement('div', { className: 'stat-value' }, stats.total_containers),            React.createElement('span', { style: { marginLeft: '4px' } }, 'Create Backup')

                React.createElement('div', { className: 'stat-detail' },           )

                  `${stats.running_containers} running`)        )

              ),      ),

              React.createElement('div', { className: 'stat-card' },      // Content Wrapper

                React.createElement('h3', null, 'Backups'),      React.createElement('div', { key: 'content-wrapper', className: 'content-wrapper' },

                React.createElement('div', { className: 'stat-value' }, stats.total_backups)      activeTab === 'dashboard' && stats && React.createElement('div', { className: 'dashboard' },

              )        React.createElement('div', { className: 'stats-grid' },

            ),          React.createElement('div', { className: 'stat-card' },

            // Additional dashboard content...            React.createElement('h3', null, 'Templates'),

            stats.unmatched_templates > 0 && React.createElement('div', { className: 'alert alert-warning' },            React.createElement('div', { className: 'stat-value' }, stats.total_templates),

              React.createElement('strong', null, `⚠️ ${stats.unmatched_templates} unused templates detected`),            React.createElement('div', { className: 'stat-detail' }, 

              React.createElement('button', { onClick: () => handleCleanupTemplates(true), disabled: loading },               `${stats.matched_templates} matched, ${stats.unmatched_templates} unused`)

                'Clean Up Unused Templates')          ),

            )          React.createElement('div', { className: 'stat-card' },

          ),            React.createElement('h3', null, 'Containers'),

            React.createElement('div', { className: 'stat-value' }, stats.total_containers),

          // Templates Tab Content            React.createElement('div', { className: 'stat-detail' }, 

          activeTab === 'templates' && React.createElement('div', { className: 'templates' },              `${stats.running_containers} running`)

            selectedTemplates.length > 0 && React.createElement('div', { className: 'bulk-actions-bar' },          ),

              React.createElement('div', { className: 'bulk-actions-content' },          React.createElement('div', { className: 'stat-card' },

                React.createElement('span', { className: 'selected-count' },             React.createElement('h3', null, 'Backups'),

                  `${selectedTemplates.length} template${selectedTemplates.length > 1 ? 's' : ''} selected`            React.createElement('div', { className: 'stat-value' }, stats.total_backups)

                ),          )

                React.createElement('div', { className: 'bulk-actions-buttons' },        ),

                  React.createElement('button', {         stats.unmatched_templates > 0 && React.createElement('div', { className: 'alert alert-warning' },

                    className: 'btn-danger',          React.createElement('strong', null, `⚠️ ${stats.unmatched_templates} unused templates detected`),

                    onClick: handleDeleteSelected,           React.createElement('button', { onClick: () => handleCleanupTemplates(true), disabled: loading }, 

                    disabled: loading             'Clean Up Unused Templates')

                  },         ),

                    React.createElement('i', { className: 'fas fa-trash' }),        React.createElement('div', { className: 'quick-actions' },

                    React.createElement('span', { style: { marginLeft: '4px' } }, 'Delete Selected')          React.createElement('h3', null, 'Quick Actions'),

                  ),          React.createElement('button', { onClick: () => handleCreateBackup(), disabled: loading }, 

                  React.createElement('button', {             React.createElement('i', { className: 'lni lni-cloud-upload' }),

                    className: 'btn-secondary',            React.createElement('span', { style: { marginLeft: '4px' } }, 'Create Backup')

                    onClick: () => setSelectedTemplates([])          ),

                  },           React.createElement('button', { onClick: () => fetchStats() }, 

                    React.createElement('i', { className: 'fas fa-times' }),            React.createElement('i', { className: 'lni lni-reload' }),

                    React.createElement('span', { style: { marginLeft: '4px' } }, 'Clear Selection')            React.createElement('span', { style: { marginLeft: '4px' } }, 'Refresh Stats')

                  )          )

                )        ),

              )        // Migration Guide Section

            ),        React.createElement('div', { className: 'migration-guide-section' },

            // Templates table...          React.createElement('h3', null, 

            React.createElement('div', { className: 'table-container' },            React.createElement('i', { className: 'lni lni-book', style: { marginRight: '8px' } }),

              // Templates table content...            'Docker Migration Guides'

            )          ),

          ),          React.createElement('div', { className: 'migration-cards' },

            // vDisk to Folder Guide

          // Containers Tab Content            React.createElement('div', { className: 'migration-card' },

          activeTab === 'containers' && React.createElement('div', { className: 'containers' },              React.createElement('h4', null, 

            // Container content...                React.createElement('i', { className: 'lni lni-arrow-right', style: { marginRight: '8px' } }),

          ),                'vDisk → Folder Migration'

              ),

          // Backups Tab Content              React.createElement('p', { className: 'migration-desc' }, 'Convert your Docker containers from vdisk.img to folder-based storage'),

          activeTab === 'backups' && React.createElement('div', { className: 'backups' },              React.createElement('div', { className: 'pros-cons' },

            // Backup content...                React.createElement('div', { className: 'pros' },

          )                  React.createElement('strong', null, '✅ Pros:'),

        ),                  React.createElement('ul', null,

                    React.createElement('li', null, 'Better performance'),

        // Footer                    React.createElement('li', null, 'Easier backups'),

        React.createElement('footer', { className: 'footer' },                    React.createElement('li', null, 'No size limits'),

          React.createElement('p', null, 'Docker Template Manager v1.3.0 | Made for Unraid')                    React.createElement('li', null, 'Direct file access')

        )                  )

      ),                ),

                React.createElement('div', { className: 'cons' },

      // Mobile Menu Button                  React.createElement('strong', null, '⚠️ Cons:'),

      React.createElement('button', {                  React.createElement('ul', null,

        className: 'mobile-menu-button',                    React.createElement('li', null, 'Requires migration time'),

        onClick: () => setMobileMenuOpen(!mobileMenuOpen)                    React.createElement('li', null, 'Need free space'),

      }, mobileMenuOpen ? '✕' : '☰')                    React.createElement('li', null, 'Risk if not backed up')

    )                  )

  );                )

}              ),

              React.createElement('button', {

// Export for global access                className: 'migration-button',

window.App = App;                onClick: () => window.open('https://wiki.unraid.net/Docker_Migration#From_vDisk_to_Folder', '_blank')
              }, 
                React.createElement('i', { className: 'lni lni-book' }),
                React.createElement('span', { style: { marginLeft: '4px' } }, 'View Guide')
              )
            ),
            // Folder to vDisk Guide
            React.createElement('div', { className: 'migration-card' },
              React.createElement('h4', null, 
                React.createElement('i', { className: 'lni lni-arrow-left', style: { marginRight: '8px' } }),
                'Folder → vDisk Migration'
              ),
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
              }, 
                React.createElement('i', { className: 'lni lni-book' }),
                React.createElement('span', { style: { marginLeft: '4px' } }, 'View Guide')
              )
            )
          ),
          React.createElement('div', { className: 'migration-note' },
            React.createElement('strong', null, '💡 Tip: '),
            React.createElement('span', null, 'Always create a backup before migrating! Use the backup feature above.')
          )
        )
      ),
      activeTab === 'templates' && React.createElement('div', { className: 'templates' },
        // Bulk Actions Bar (only when templates are selected)
        selectedTemplates.length > 0 && React.createElement('div', { className: 'bulk-actions-bar' },
          React.createElement('div', { className: 'bulk-actions-content' },
            React.createElement('span', { className: 'selected-count' }, 
              `${selectedTemplates.length} template${selectedTemplates.length > 1 ? 's' : ''} selected`
            ),
            React.createElement('div', { className: 'bulk-actions-buttons' },
              React.createElement('button', { 
                className: 'btn-danger',
                onClick: handleDeleteSelected, 
                disabled: loading 
              }, 
                React.createElement('i', { className: 'fas fa-trash' }),
                React.createElement('span', { style: { marginLeft: '4px' } }, 'Delete Selected')
              ),
              React.createElement('button', { 
                className: 'btn-secondary',
                onClick: () => setSelectedTemplates([])
              }, 
                React.createElement('i', { className: 'fas fa-times' }),
                React.createElement('span', { style: { marginLeft: '4px' } }, 'Clear Selection')
              )
            )
          )
        ),
        React.createElement('div', { className: 'section-header' },
          React.createElement('div', { className: 'actions' },
            React.createElement('button', { onClick: () => handleCleanupTemplates(true), disabled: loading }, 
              React.createElement('i', { className: 'fas fa-broom' }),
              React.createElement('span', { style: { marginLeft: '4px' } }, 'Clean Up Unused')
            )
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
                React.createElement('th', null, 'Modified')
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
                React.createElement('td', null, formatDate(template.modified))
              )),
            // Individual Template Actions (appears below selected template)
            selectedRow && React.createElement('tr', { key: `${selectedRow}-actions`, className: 'template-actions-row' },
              React.createElement('td', { colSpan: 6, className: 'template-actions-cell' },
                React.createElement('div', { className: 'template-actions' },
                  React.createElement('div', { className: 'template-actions-header' },
                    React.createElement('span', { className: 'template-name' }, selectedRow),
                    React.createElement('button', { 
                      className: 'btn-close',
                      onClick: () => setSelectedRow(null)
                    }, 
                      React.createElement('i', { className: 'fas fa-times' })
                    )
                  ),
                  React.createElement('div', { className: 'template-actions-buttons' },
                    React.createElement('button', {
                      className: 'btn-primary',
                      onClick: () => { handleViewTemplate(selectedRow); setSelectedRow(null); },
                      title: 'View/Edit template'
                    }, 
                      React.createElement('i', { className: 'fas fa-eye' }),
                      React.createElement('span', { style: { marginLeft: '4px' } }, 'View/Edit')
                    ),
                    React.createElement('button', {
                      className: 'btn-secondary',
                      onClick: () => { handleRenameTemplate(selectedRow); setSelectedRow(null); },
                      title: 'Rename template'
                    }, 
                      React.createElement('i', { className: 'fas fa-pencil-alt' }),
                      React.createElement('span', { style: { marginLeft: '4px' } }, 'Rename')
                    ),
                    React.createElement('button', {
                      className: 'btn-secondary',
                      onClick: () => { handleCloneTemplate(selectedRow); setSelectedRow(null); },
                      title: 'Clone template'
                    }, 
                      React.createElement('i', { className: 'fas fa-copy' }),
                      React.createElement('span', { style: { marginLeft: '4px' } }, 'Clone')
                    ),
                    React.createElement('button', {
                      className: 'btn-danger',
                      onClick: () => { 
                        if (window.confirm(`Delete template "${selectedRow}"?`)) {
                          handleDeleteTemplate(selectedRow);
                          setSelectedRow(null);
                        }
                      },
                      title: 'Delete template'
                    }, 
                      React.createElement('i', { className: 'fas fa-trash' }),
                      React.createElement('span', { style: { marginLeft: '4px' } }, 'Delete')
                    )
                  )
                )
              )
            )
          )
        )
      ),
      activeTab === 'containers' && React.createElement('div', { className: 'containers' },
        // Bulk Actions Bar (only when containers are selected)
        selectedContainers.length > 0 && React.createElement('div', { className: 'bulk-actions-bar' },
          React.createElement('div', { className: 'bulk-actions-content' },
            React.createElement('span', { className: 'selected-count' }, 
              `${selectedContainers.length} container${selectedContainers.length > 1 ? 's' : ''} selected`
            ),
            React.createElement('div', { className: 'bulk-actions-buttons' },
              React.createElement('button', { 
                className: 'btn-success',
                onClick: () => handleBulkContainerAction('start'), 
                disabled: loading 
              }, 
                React.createElement('i', { className: 'fas fa-play' }),
                React.createElement('span', { style: { marginLeft: '4px' } }, 'Start All')
              ),
              React.createElement('button', { 
                className: 'btn-danger',
                onClick: () => handleBulkContainerAction('stop'), 
                disabled: loading 
              }, 
                React.createElement('i', { className: 'fas fa-stop' }),
                React.createElement('span', { style: { marginLeft: '4px' } }, 'Stop All')
              ),
              React.createElement('button', { 
                className: 'btn-secondary',
                onClick: () => handleBulkContainerAction('restart'), 
                disabled: loading 
              }, 
                React.createElement('i', { className: 'fas fa-redo' }),
                React.createElement('span', { style: { marginLeft: '4px' } }, 'Restart All')
              ),
              React.createElement('button', { 
                className: 'btn-secondary',
                onClick: () => setSelectedContainers([])
              }, 
                React.createElement('i', { className: 'fas fa-times' }),
                React.createElement('span', { style: { marginLeft: '4px' } }, 'Clear Selection')
              )
            )
          )
        ),
        React.createElement('div', { className: 'section-header' },
          React.createElement('button', { onClick: fetchContainers }, 
            React.createElement('i', { className: 'fas fa-sync-alt' }),
            React.createElement('span', { style: { marginLeft: '4px' } }, 'Refresh')
          )
        ),
        React.createElement('div', { className: 'table-container' },
          React.createElement('table', null,
            React.createElement('thead', null,
              React.createElement('tr', null,
                React.createElement('th', null, 
                  React.createElement('input', { 
                    type: 'checkbox',
                    onChange: (e) => {
                      if (e.target.checked) {
                        setSelectedContainers(containers.map(c => c.name));
                      } else {
                        setSelectedContainers([]);
                      }
                    },
                    checked: selectedContainers.length === containers.length && containers.length > 0
                  })
                ),
                React.createElement('th', null, 'Status'),
                React.createElement('th', null, 'Name'),
                React.createElement('th', null, 'Image'),
                React.createElement('th', null, 'State'),
                React.createElement('th', null, 'Template')
              )
            ),
            React.createElement('tbody', null,
              containers.map(container => React.createElement('tr', { 
                key: container.id,
                className: selectedContainerRow === container.name ? 'selected' : '',
                onClick: () => setSelectedContainerRow(selectedContainerRow === container.name ? null : container.name)
              },
                React.createElement('td', { className: 'checkbox-cell' },
                  React.createElement('input', {
                    type: 'checkbox',
                    checked: selectedContainers.includes(container.name),
                    onChange: (e) => {
                      e.stopPropagation();
                      toggleContainerSelection(container.name);
                    }
                  })
                ),
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
                )
              )),
            // Individual Container Actions (appears below selected container)
            selectedContainerRow && React.createElement('tr', { key: `${selectedContainerRow}-actions`, className: 'container-actions-row' },
              React.createElement('td', { colSpan: 6, className: 'container-actions-cell' },
                React.createElement('div', { className: 'container-actions' },
                  React.createElement('div', { className: 'container-actions-header' },
                    React.createElement('span', { className: 'container-name' }, selectedContainerRow),
                    React.createElement('button', { 
                      className: 'btn-close',
                      onClick: () => setSelectedContainerRow(null)
                    }, 
                      React.createElement('i', { className: 'fas fa-times' })
                    )
                  ),
                  React.createElement('div', { className: 'container-actions-buttons' },
                    containers.find(c => c.name === selectedContainerRow)?.state === 'running' ? 
                      React.createElement(React.Fragment, null,
                        React.createElement('button', {
                          className: 'btn-danger',
                          onClick: () => { 
                            handleContainerAction(selectedContainerRow, 'stop');
                            setSelectedContainerRow(null);
                          },
                          disabled: loading,
                          title: 'Stop container'
                        }, 
                          React.createElement('i', { className: 'fas fa-stop' }),
                          React.createElement('span', { style: { marginLeft: '4px' } }, 'Stop')
                        ),
                        React.createElement('button', {
                          className: 'btn-secondary',
                          onClick: () => { 
                            handleContainerAction(selectedContainerRow, 'restart');
                            setSelectedContainerRow(null);
                          },
                          disabled: loading,
                          title: 'Restart container'
                        }, 
                          React.createElement('i', { className: 'fas fa-redo' }),
                          React.createElement('span', { style: { marginLeft: '4px' } }, 'Restart')
                        )
                      ) : 
                      React.createElement('button', {
                        className: 'btn-success',
                        onClick: () => { 
                          handleContainerAction(selectedContainerRow, 'start');
                          setSelectedContainerRow(null);
                        },
                        disabled: loading,
                        title: 'Start container'
                      }, 
                        React.createElement('i', { className: 'fas fa-play' }),
                        React.createElement('span', { style: { marginLeft: '4px' } }, 'Start')
                      )
                  )
                )
              )
            )
          )
        )
      ),
      activeTab === 'backups' && React.createElement('div', { className: 'backups' },
        React.createElement('div', { className: 'section-header' },
          React.createElement('button', { onClick: handleCreateBackup, disabled: loading }, 
            React.createElement('i', { className: 'lni lni-cloud-upload' }),
            React.createElement('span', { style: { marginLeft: '4px' } }, 'Create New Backup')
          )
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
                }, 
                  React.createElement('i', { className: 'lni lni-reload' }),
                  React.createElement('span', { style: { marginLeft: '4px' } }, 'Restore')
                ),
                React.createElement('button', { 
                  className: 'btn-danger',
                  onClick: () => handleDeleteBackup(backup.name),
                  disabled: loading
                }, 
                  React.createElement('i', { className: 'lni lni-trash-can' }),
                  React.createElement('span', { style: { marginLeft: '4px' } }, 'Delete')
                )
              )
            ))
          )
        )
      ),
      // Footer
      React.createElement('footer', { className: 'footer' },
        React.createElement('p', null, 'Docker Template Manager v1.3.0 | Made for Unraid')
      ),
      // Mobile Menu Button
      !showApiKeyPrompt && React.createElement('button', {
        className: 'mobile-menu-button',
        onClick: () => setMobileMenuOpen(!mobileMenuOpen)
      }, mobileMenuOpen ? '✕' : '☰')
    )
  );
  return container;
}
// Export for global access
window.App = App;