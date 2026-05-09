import React, { useState, useEffect } from "react";
import { useElectionData } from "../lib/useElectionData";
import { Plus, Trash2, Save, ExternalLink } from "lucide-react";

export default function Dashboard() {
  const { data, updateData } = useElectionData();
  const [stagingData, setStagingData] = useState<any>(null);
  const [newResult, setNewResult] = useState({ constituency: "", result: "", partyId: "lab" });

  useEffect(() => {
    // Only initialize stagingData once when data is fetched, or keep updating it?
    // We shouldn't overwrite unsaved changes unless required, but for simplicity,
    // if stagingData is null, initialize it. If the server pushes an update, we might want to sync?
    // Let's just sync when data arrives if staging is null.
    if (data && !stagingData) {
      setStagingData(data);
    }
  }, [data, stagingData]);

  if (!stagingData) return <div className="p-8">Loading dashboard...</div>;

  const handleUpdate = (updates: any) => {
    setStagingData({ ...stagingData, ...updates });
  };

  const publishChanges = () => {
    updateData(stagingData);
  };

  const loadPreset = (presetName: string) => {
      let overrides: any = {};
      if (presetName === 'election_hung') {
          overrides = {
              theme: "election",
              mode: "exit_poll",
              tickerMode: "text",
              headline: "EXIT POLL: HUNG PARLIAMENT",
              subheadline: "Exit poll predicts Hung Parliament with Conservatives as largest party",
              primaryColor: "#280058",
              darkColor: "#1E0043",
              logoTitle: "ELECTION",
              crystalUrl: "",
              breaking: true,
              majorityTarget: 11,
              parties: stagingData.parties.map((p: any) => ({
                  ...p,
                  seats: p.id === 'con' ? 10 : p.id === 'lab' ? 2 : p.id === 'bin' ? 8 : 0,
                  visible: ['lab', 'con', 'ld', 'bin'].includes(p.id)
              }))
          };
      } else if (presetName === 'election_landslide') {
          overrides = {
              theme: "election",
              mode: "exit_poll",
              tickerMode: "results",
              headline: "EXIT POLL: LABOUR LANDSLIDE",
              subheadline: "Sir Keir Starmer's party is forecast to win a majority of 170 seats",
              primaryColor: "#280058",
              darkColor: "#1E0043",
              logoTitle: "ELECTION",
              crystalUrl: "",
              breaking: false,
              majorityTarget: 326,
              parties: stagingData.parties.map((p: any) => ({
                  ...p,
                  seats: p.id === 'lab' ? 410 : p.id === 'con' ? 131 : p.id === 'ld' ? 61 : p.id === 'ref' ? 13 : p.id === 'pc' ? 4 : 0,
                  visible: ['lab', 'con', 'ld', 'ref', 'pc'].includes(p.id)
              }))
          };
      } else if (presetName === 'news_banner') {
          overrides = {
              theme: "news",
              tickerMode: "text",
              headline: "Court rejects Virginia Democrats redistricting plan",
              subheadline: "",
              tickerItems: ["Iran accuses US of 'reckless military adventure'"],
              primaryColor: "#B80000",
              darkColor: "#B80000",
              logoTitle: "NEWS",
              bbcBoxesClass: "bg-white text-black",
              crystalUrl: "",
              breaking: false
          };
      }
      handleUpdate(overrides);
  };

  const togglePartyVisibility = (index: number) => {
      const newParties = [...stagingData.parties];
      newParties[index].visible = !newParties[index].visible;
      handleUpdate({ parties: newParties });
  };

  const addResult = () => {
    const party = stagingData.parties.find((p: any) => p.id === newResult.partyId);
    if (!party) return;
    
    const result = {
        constituency: newResult.constituency,
        result: newResult.result,
        partyColor: party.color,
        partyId: party.id
    };

    handleUpdate({
        recentResults: [result, ...stagingData.recentResults].slice(0, 5) // keep last 5
    });
    setNewResult({ constituency: "", result: "", partyId: "lab" });
  };

  const hasUnsavedChanges = JSON.stringify(data) !== JSON.stringify(stagingData);

  return (
    <div className="min-h-screen bg-neutral-100 p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-neutral-200">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">Election Control</h1>
            <p className="text-neutral-500 mt-1">Manage live graphics and data (Draft Mode)</p>
          </div>
          <div className="flex gap-4 items-center flex-wrap justify-end">
             <div className="flex items-center gap-2 mr-4 border-r border-neutral-300 pr-4">
                 <button onClick={() => loadPreset('election_hung')} className="text-sm font-medium bg-neutral-100 hover:bg-neutral-200 px-3 py-1.5 rounded text-neutral-700">Preset: Hung</button>
                 <button onClick={() => loadPreset('election_landslide')} className="text-sm font-medium bg-neutral-100 hover:bg-neutral-200 px-3 py-1.5 rounded text-neutral-700">Preset: Landslide</button>
                 <button onClick={() => loadPreset('news_banner')} className="text-sm font-medium bg-neutral-100 hover:bg-neutral-200 px-3 py-1.5 rounded text-neutral-700">Preset: News</button>
             </div>
             {hasUnsavedChanges && (
                <span className="text-amber-600 font-medium text-sm animate-pulse">Unsaved changes...</span>
             )}
            <button 
              onClick={publishChanges}
              className={`flex items-center gap-2 px-6 py-2.5 font-bold rounded-lg transition-all ${hasUnsavedChanges ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg' : 'bg-neutral-200 text-neutral-500 cursor-not-allowed'}`}
              disabled={!hasUnsavedChanges}
            >
              <Save className="w-5 h-5" />
              Publish Graphic
            </button>
            <a href="/overlay" target="_blank" className="flex items-center gap-2 px-5 py-2.5 border border-neutral-300 bg-white text-neutral-700 font-medium rounded-lg hover:bg-neutral-50 transition-colors">
              <ExternalLink className="w-4 h-4" />
              Overlay
            </a>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-8 space-y-8">
              {/* Headlines Card */}
              <section className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200 space-y-6">
                 <h2 className="text-xl font-bold border-b pb-2">Main Graphic Content</h2>
                 
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">Theme / Branding</label>
                        <select 
                            className="w-full border border-neutral-300 p-2 rounded focus:ring-2 focus:ring-[#2D0060] outline-none"
                            value={stagingData.theme}
                            onChange={(e) => handleUpdate({ theme: e.target.value })}
                        >
                            <option value="election">BBC Election Graphic</option>
                            <option value="news">BBC News Banner</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">Graphic Mode (Top Right Text)</label>
                        <select 
                            className="w-full border border-neutral-300 p-2 rounded focus:ring-2 focus:ring-[#2D0060] outline-none"
                            value={stagingData.mode}
                            onChange={(e) => handleUpdate({ mode: e.target.value })}
                        >
                            <option value="exit_poll">EXIT POLL</option>
                            <option value="results">RESULTS</option>
                        </select>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">Ticker Mode (Bottom Bar)</label>
                        <select 
                            className="w-full border border-neutral-300 p-2 rounded focus:ring-2 focus:ring-[#2D0060] outline-none"
                            value={stagingData.tickerMode}
                            onChange={(e) => handleUpdate({ tickerMode: e.target.value })}
                        >
                            <option value="text">Static Text Bullet</option>
                            <option value="results">Recent Results Flashes</option>
                        </select>
                    </div>
                 </div>

                 <div className="grid grid-cols-3 gap-4 pt-4 border-t border-neutral-100">
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">Global Primary Color</label>
                        <div className="flex gap-2">
                            <input 
                                type="color" 
                                className="h-10 w-12 border border-neutral-300 rounded cursor-pointer"
                                value={stagingData.primaryColor || '#280058'}
                                onChange={(e) => handleUpdate({ primaryColor: e.target.value })}
                            />
                            <input 
                                type="text" 
                                className="flex-1 border border-neutral-300 p-2 rounded font-mono text-sm"
                                value={stagingData.primaryColor || '#280058'}
                                onChange={(e) => handleUpdate({ primaryColor: e.target.value })}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">Global Dark Color</label>
                        <div className="flex gap-2">
                            <input 
                                type="color" 
                                className="h-10 w-12 border border-neutral-300 rounded cursor-pointer"
                                value={stagingData.darkColor || '#1E0043'}
                                onChange={(e) => handleUpdate({ darkColor: e.target.value })}
                            />
                            <input 
                                type="text" 
                                className="flex-1 border border-neutral-300 p-2 rounded font-mono text-sm"
                                value={stagingData.darkColor || '#1E0043'}
                                onChange={(e) => handleUpdate({ darkColor: e.target.value })}
                            />
                        </div>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">Logo Title</label>
                        <input 
                            type="text" 
                            className="w-full border border-neutral-300 p-2 rounded uppercase"
                            value={stagingData.logoTitle}
                            onChange={(e) => handleUpdate({ logoTitle: e.target.value })}
                        />
                    </div>
                </div>
                
                 <div className="grid grid-cols-2 gap-4 pt-4 border-t border-neutral-100">
                     <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">Custom Image URL (Cyrstal/Icon)</label>
                        <input 
                            type="text" 
                            placeholder="Leave blank for default generated CSS icon"
                            className="w-full border border-neutral-300 p-2 rounded text-sm placeholder:text-neutral-400"
                            value={stagingData.crystalUrl || ''}
                            onChange={(e) => handleUpdate({ crystalUrl: e.target.value })}
                        />
                     </div>
                 </div>

                 <div className="space-y-4 pt-4 border-t border-neutral-100">
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">Headline</label>
                        <input 
                            type="text" 
                            className="w-full border border-neutral-300 p-2 rounded font-bold text-xl uppercase"
                            value={stagingData.headline}
                            onChange={(e) => handleUpdate({ headline: e.target.value })}
                        />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">Subheadline</label>
                        <input 
                            type="text" 
                            className="w-full border border-neutral-300 p-2 rounded"
                            value={stagingData.subheadline}
                            onChange={(e) => handleUpdate({ subheadline: e.target.value })}
                        />
                    </div>
                     <div className="flex items-center gap-3 bg-red-50 p-3 rounded-lg border border-red-100 mt-2">
                        <input 
                            type="checkbox" 
                            id="breaking"
                            className="w-5 h-5 text-red-600 rounded"
                            checked={stagingData.breaking}
                            onChange={(e) => handleUpdate({ breaking: e.target.checked })}
                        />
                        <label htmlFor="breaking" className="text-sm font-bold text-red-700 uppercase tracking-wider">Show Breaking Badge</label>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1 mt-4">Majority Target (Appears below scoreboard)</label>
                        <input 
                            type="number" 
                            className="w-48 border border-neutral-300 p-2 rounded"
                            value={stagingData.majorityTarget}
                            onChange={(e) => handleUpdate({ majorityTarget: parseInt(e.target.value) || 0 })}
                        />
                    </div>
                 </div>
              </section>

              {/* Ticker Management */}
              <section className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200 space-y-6">
                 <h2 className="text-xl font-bold border-b pb-2">Ticker Content</h2>
                  
                  {stagingData.tickerMode === 'text' ? (
                      <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-1">Static Text Line</label>
                          <input 
                            type="text" 
                            className="w-full border border-neutral-300 p-3 rounded"
                            value={stagingData.tickerItems[0]}
                            onChange={(e) => {
                                const newItems = [...stagingData.tickerItems];
                                newItems[0] = e.target.value;
                                handleUpdate({ tickerItems: newItems });
                            }}
                          />
                      </div>
                  ) : (
                    <div>
                        <div className="flex gap-2">
                            <input 
                                    type="text" 
                                    placeholder="Constituency"
                                    className="border border-neutral-300 p-2 rounded flex-1"
                                    value={newResult.constituency}
                                    onChange={(e) => setNewResult({...newResult, constituency: e.target.value})}
                                />
                                <input 
                                    type="text" 
                                    placeholder="Result (e.g. LAB HOLD)"
                                    className="border border-neutral-300 p-2 rounded w-48"
                                    value={newResult.result}
                                    onChange={(e) => setNewResult({...newResult, result: e.target.value.toUpperCase()})}
                                />
                                <select 
                                    className="border border-neutral-300 p-2 rounded w-32"
                                    value={newResult.partyId}
                                    onChange={(e) => setNewResult({...newResult, partyId: e.target.value})}
                                >
                                    {stagingData.parties.map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
                                </select>
                                <button onClick={addResult} className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
                                    <Plus className="w-5 h-5" />
                                </button>
                        </div>

                        <div className="space-y-2 mt-4">
                            {stagingData.recentResults.map((res: any, i: number) => (
                                <div key={i} className="flex justify-between items-center p-3 bg-neutral-50 border border-neutral-200 rounded">
                                    <div className="flex gap-4 items-center">
                                        <span className="font-bold">{res.constituency}</span>
                                        <span className="px-3 py-1 text-xs font-bold text-white rounded uppercase" style={{backgroundColor: res.partyColor}}>
                                            {res.result}
                                        </span>
                                    </div>
                                    <button 
                                        onClick={() => {
                                            const newRecent = [...stagingData.recentResults];
                                            newRecent.splice(i, 1);
                                            handleUpdate({ recentResults: newRecent });
                                        }}
                                        className="text-red-500 hover:text-red-700 p-1"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                            {stagingData.recentResults.length === 0 && (
                                <div className="text-neutral-500 text-sm italic">No recent results to show. Ticker uses fallback.</div>
                            )}
                        </div>
                    </div>
                  )}
              </section>
          </div>

          {/* Party Scores sidebar */}
          <div className="lg:col-span-4">
              <section className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200 sticky top-8">
                   <h2 className="text-xl font-bold border-b pb-4 mb-4">Party Scoreboard</h2>
                   <p className="text-sm text-neutral-500 mb-4">Toggle eye icon to show/hide party in graphic.</p>
                   
                   <div className="space-y-3">
                        {stagingData.parties.map((party: any, index: number) => (
                            <div key={party.id} className={`flex items-center gap-3 p-3 rounded-lg border transition-opacity ${party.visible ? 'bg-white border-neutral-300 shadow-sm' : 'bg-neutral-50 border-neutral-200 opacity-60'}`}>
                                <div 
                                    className="w-10 h-10 rounded-md flex items-center justify-center font-bold text-white shrink-0 text-sm overflow-hidden relative cursor-pointer"
                                    style={{ backgroundColor: party.color, opacity: party.visible ? 1 : 0.5 }}
                                >
                                    {party.name}
                                    <input 
                                        type="color"
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        value={party.color}
                                        onChange={(e) => {
                                            const newParties = [...stagingData.parties];
                                            newParties[index].color = e.target.value;
                                            handleUpdate({ parties: newParties });
                                        }}
                                        title="Change color"
                                    />
                                </div>
                                <div className="flex-1">
                                    <input 
                                        type="number" 
                                        className="w-full border-b border-transparent focus:border-[#2D0060] font-mono text-2xl font-bold p-1 bg-transparent outline-none transition-colors"
                                        value={party.seats}
                                        onChange={(e) => {
                                            const newParties = [...stagingData.parties];
                                            newParties[index].seats = parseInt(e.target.value) || 0;
                                            handleUpdate({ parties: newParties });
                                        }}
                                        disabled={!party.visible}
                                    />
                                    <input 
                                        type="text" 
                                        className="w-full text-xs text-neutral-500 mt-1 uppercase bg-transparent outline-none uppercase"
                                        value={party.name}
                                        onChange={(e) => {
                                            const newParties = [...stagingData.parties];
                                            newParties[index].name = e.target.value.toUpperCase();
                                            handleUpdate({ parties: newParties });
                                        }}
                                    />
                                </div>
                                <button 
                                    onClick={() => togglePartyVisibility(index)}
                                    className={`p-2 rounded hover:bg-neutral-200 transition-colors ${party.visible ? 'text-blue-600' : 'text-neutral-400'}`}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        {party.visible ? (
                                            <>
                                                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                                                <circle cx="12" cy="12" r="3"/>
                                            </>
                                        ) : (
                                            <>
                                                <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/>
                                                <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/>
                                                <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/>
                                                <line x1="2" x2="22" y1="2" y2="22"/>
                                            </>
                                        )}
                                    </svg>
                                </button>
                            </div>
                        ))}
                   </div>
              </section>
          </div>

        </div>
      </div>
    </div>
  );
}
