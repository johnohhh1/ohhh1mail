'use client';

import { useState } from 'react';
import SettingsLayout from '@/components/settings/SettingsLayout';

export default function SettingsPage() {
    const [autoSave, setAutoSave] = useState('30s');
    const [defaultView, setDefaultView] = useState('inbox');
    const [openLinksIn, setOpenLinksIn] = useState('default');

    return (
        <SettingsLayout>
            <div className="space-y-8">
                <div>
                    <h2 className="text-2xl font-bold mb-2">General Settings</h2>
                    <p className="text-gray-600">Manage your general preferences and workspace behavior.</p>
                </div>

                {/* Window Behavior */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
                    <h3 className="text-lg font-semibold">Window Behavior</h3>

                    <div className="flex items-center justify-between">
                        <div>
                            <div className="font-medium">Save window position</div>
                            <div className="text-sm text-gray-500">Restore window size and position on startup</div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Open links in</label>
                            <select
                                value={openLinksIn}
                                onChange={(e) => setOpenLinksIn(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="default">System Default</option>
                                <option value="chrome">Google Chrome</option>
                                <option value="firefox">Firefox</option>
                                <option value="safari">Safari</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Default view</label>
                            <select
                                value={defaultView}
                                onChange={(e) => setDefaultView(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="inbox">Inbox</option>
                                <option value="focused">Focused</option>
                                <option value="team">Team</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Auto-Save */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
                    <h3 className="text-lg font-semibold">Auto-Save Preferences</h3>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Auto-save drafts every</label>
                        <select
                            value={autoSave}
                            onChange={(e) => setAutoSave(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="30s">30 seconds</option>
                            <option value="1m">1 minute</option>
                            <option value="5m">5 minutes</option>
                        </select>
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <div className="font-medium">Keep failed syncs</div>
                            <div className="text-sm text-gray-500">Retain failed sync attempts for review</div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                    </div>
                </div>
            </div>
        </SettingsLayout>
    );
}
