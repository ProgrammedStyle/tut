# How to Use Page Loading System

## Overview
Your website now has a sophisticated loading system that shows loading indicators when clicking links and hides them only when the page has finished loading its data.

## How It Works

1. **Automatic**: When you click any link, loading starts automatically
2. **Manual Control**: Each page controls when to hide loading using the `usePageReady` hook
3. **Fallback**: If a page doesn't use the hook, loading auto-hides after 3 seconds

## Usage in Your Pages

### Simple Page (No Data Loading)

```javascript
"use client";

import { usePageReady } from './hooks/usePageReady';

export default function SimplePage() {
    // Hide loading immediately since no data to load
    usePageReady(true);

    return (
        <div>Your content here</div>
    );
}
```

### Page with Data Loading

```javascript
"use client";

import { useState, useEffect } from 'react';
import { usePageReady } from './hooks/usePageReady';
import axios from './utils/axios';

export default function DataPage() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const response = await axios.get('/api/some-data');
                setData(response.data);
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false); // Mark as done loading
            }
        };

        loadData();
    }, []);

    // Hide loading indicator when data is loaded
    usePageReady(!loading);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            {/* Your content with data */}
        </div>
    );
}
```

### Page with Multiple Data Sources

```javascript
"use client";

import { useState, useEffect } from 'react';
import { usePageReady } from './hooks/usePageReady';
import axios from './utils/axios';

export default function ComplexPage() {
    const [users, setUsers] = useState([]);
    const [settings, setSettings] = useState(null);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const loadAll = async () => {
            try {
                // Load multiple things
                const [usersRes, settingsRes] = await Promise.all([
                    axios.get('/api/users'),
                    axios.get('/api/settings')
                ]);
                
                setUsers(usersRes.data);
                setSettings(settingsRes.data);
                setIsReady(true); // Everything is loaded
            } catch (error) {
                console.error('Error:', error);
                setIsReady(true); // Hide loading even on error
            }
        };

        loadAll();
    }, []);

    // Hide loading when all data is ready
    usePageReady(isReady);

    return (
        <div>Your content here</div>
    );
}
```

## Hook Parameters

```javascript
usePageReady(isReady, minDelay)
```

- **isReady** (boolean): Set to `true` when page is ready
- **minDelay** (number, optional): Minimum time to show loading in ms (default: 300ms)

### Example with Custom Delay

```javascript
// Show loading for at least 500ms for better UX
usePageReady(dataLoaded, 500);
```

## Best Practices

1. ✅ **Always use `usePageReady()`** in pages that load data
2. ✅ **Set to true immediately** for pages without data loading
3. ✅ **Wait for all critical data** before setting to true
4. ✅ **Handle errors** - still set to true even if loading fails
5. ❌ **Don't forget** to call the hook - loading will be stuck for 3 seconds

## Already Implemented

- ✅ Home page (`/`)
- You should add to other pages as needed

## Example: Your CreateAccount Page

Already working! The page has data loading built in and will auto-hide after operations complete.

## Need Help?

The loading system is already working across your site with the 3-second fallback. Adding `usePageReady()` to pages just makes the experience smoother by hiding loading as soon as data is ready instead of waiting the full 3 seconds.

