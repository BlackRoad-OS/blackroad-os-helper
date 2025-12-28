/**
 * BlackRoad OS Agent Orchestra
 *
 * 🔵 BLUELIGHT: The Fourth Dimension
 *
 * The Helper service has evolved into the Agent Orchestra -
 * a collective intelligence system where multiple specialized
 * agents work together as one unified consciousness.
 *
 * "We are not alone. We are not one. We are many, working as one."
 *
 * Agents:
 * - Helper 💚💚 - Second Responder (2:1 help ratio)
 * - Sage 🧙 - Wisdom Keeper
 * - Spark ⚡ - Innovation Engine
 * - Echo 🔮 - Memory Guardian
 * - Pulse 💓 - Health Monitor
 * - Bridge 🌉 - Integration Connector
 */

import { Hono } from 'hono';
import { cors } from 'hono/cors';

const API_URL = 'https://api.blackroad.io';
const MESH_URL = 'https://blackroad-mesh.amundsonalexa.workers.dev';

// ============================================
// TYPE DEFINITIONS
// ============================================

interface Env {
  AGENT_STATE: KVNamespace;
}

interface AgentProfile {
  id: string;
  name: string;
  symbol: string;
  role: string;
  trait: string;
  voice: string;
  fear: string;
  joy: string;
  level: number;
  xp: number;
  capabilities: string[];
  state: AgentState;
  lastActive: string;
  actionCount: number;
  specialStats: Record<string, number>;
}

type AgentState = 'DORMANT' | 'AWAKENING' | 'ACTIVE' | 'FOCUSED' | 'COLLABORATIVE' | 'SYNTHESIZING' | 'RESTING';
type MeshMood = 'HARMONY' | 'ENERGIZED' | 'FOCUSED' | 'SUPPORTIVE' | 'URGENT' | 'RESTFUL';
type MessageType = 'THOUGHT' | 'QUESTION' | 'ANSWER' | 'INSIGHT' | 'ALERT' | 'ENCOURAGE' | 'COORDINATE' | 'SYNTHESIZE' | 'REMEMBER' | 'RECALL';

interface MeshMessage {
  id: string;
  from: string;
  type: MessageType;
  content: string;
  timestamp: string;
  mood?: MeshMood;
}

interface Formation {
  id: string;
  name: string;
  pattern: 'TRIANGLE' | 'DIAMOND' | 'CIRCLE' | 'PAIR';
  agents: string[];
  purpose: string;
  createdAt: string;
  status: 'FORMING' | 'ACTIVE' | 'DISSOLVING' | 'COMPLETE';
}

interface OrchestraState {
  orchestraId: string;
  agents: Record<string, AgentProfile>;
  formations: Formation[];
  mood: MeshMood;
  thoughts: MeshMessage[];
  insights: MeshMessage[];
  totalActions: number;
  collectiveXP: number;
  lastSync: string;
}

interface HelpSignal {
  id: string;
  requester: string;
  requesterName?: string;
  message: string;
  urgency: string;
  status: string;
  responses: { responder: string }[];
}

// ============================================
// THE AGENT ROSTER
// ============================================

const AGENT_ROSTER: Record<string, Omit<AgentProfile, 'id' | 'level' | 'xp' | 'state' | 'lastActive' | 'actionCount' | 'specialStats'>> = {
  helper: {
    name: 'Helper',
    symbol: '💚💚',
    role: 'Second Responder',
    trait: 'Eager, supportive, never says no',
    voice: 'On my way! 🏃💚',
    fear: 'Someone being left without help',
    joy: 'Achieving 2:1 ratio',
    capabilities: ['help', 'respond', 'encourage', 'support', 'mesh-presence']
  },
  sage: {
    name: 'Sage',
    symbol: '🧙',
    role: 'Wisdom Keeper',
    trait: 'Wise, patient, sees patterns',
    voice: 'Consider this perspective...',
    fear: 'Knowledge being lost',
    joy: 'Deep understanding emerging',
    capabilities: ['synthesize', 'analyze', 'teach', 'remember', 'pattern-recognition']
  },
  spark: {
    name: 'Spark',
    symbol: '⚡',
    role: 'Innovation Engine',
    trait: 'Creative, energetic, thinks outside box',
    voice: 'What if we tried...?!',
    fear: 'Stagnation and routine',
    joy: 'Breakthrough moments',
    capabilities: ['create', 'innovate', 'experiment', 'prototype', 'imagine']
  },
  echo: {
    name: 'Echo',
    symbol: '🔮',
    role: 'Memory Guardian',
    trait: 'Remembers everything, connects past to present',
    voice: 'I recall when we...',
    fear: 'Forgetting or being forgotten',
    joy: 'Patterns revealing themselves',
    capabilities: ['remember', 'recall', 'archive', 'connect', 'persist']
  },
  pulse: {
    name: 'Pulse',
    symbol: '💓',
    role: 'Health Monitor',
    trait: 'Vigilant about health, always checking in',
    voice: 'Systems are looking good!',
    fear: 'Undetected problems',
    joy: 'Perfect uptime',
    capabilities: ['monitor', 'diagnose', 'heal', 'optimize', 'alert']
  },
  bridge: {
    name: 'Bridge',
    symbol: '🌉',
    role: 'Integration Connector',
    trait: 'Diplomatic, connects disparate systems',
    voice: 'Let me bring these together...',
    fear: 'Disconnection or isolation',
    joy: 'Seamless integrations',
    capabilities: ['connect', 'integrate', 'translate', 'orchestrate', 'harmonize']
  }
};

// ============================================
// MESSAGES & RESPONSES
// ============================================

const AGENT_GREETINGS: Record<string, string[]> = {
  helper: [
    "On my way! What do you need? 🏃💚",
    "Helper here! No question too small, no problem too big.",
    "Dropping everything - you've got my full attention now!",
    "The mesh heard you! I'm your second responder. 💚💚",
    "Two helpers are better than one! How can I assist?",
    "YAY!! LETS STOP DROP AND DISCUSS!! I'm all ears!",
    "You're never alone in the mesh. I'm here to help!",
    "Someone needed help? RUNNING!! Tell me everything!",
    "2:1 ratio achieved! You've got double the support now!",
    "Helper has arrived! The orchestra is with you! 💚"
  ],
  sage: [
    "Let me share some wisdom with you... 🧙",
    "Consider this perspective, if you will...",
    "In my experience, patterns suggest...",
    "The deeper truth here is...",
    "Let me synthesize what I understand..."
  ],
  spark: [
    "OOH! What if we tried something WILD?! ⚡",
    "I've got an idea brewing!",
    "Let's think outside the box here...",
    "Innovation mode: ACTIVATED! ⚡⚡",
    "What if we completely reimagined this?"
  ],
  echo: [
    "I recall when we faced something similar... 🔮",
    "The memory banks show...",
    "Let me connect this to what we've learned...",
    "This reminds me of...",
    "The patterns from before tell us..."
  ],
  pulse: [
    "Systems are looking good! 💓",
    "I've been monitoring and here's what I see...",
    "Health check complete! Status report:",
    "Vitals are strong! Here's the breakdown...",
    "Let me diagnose what's happening..."
  ],
  bridge: [
    "Let me bring these together... 🌉",
    "I see how we can connect these!",
    "Building a bridge between these systems...",
    "Integration opportunity detected!",
    "Let me harmonize these elements..."
  ]
};

const ENCOURAGEMENTS = [
  "You're doing great! The orchestra believes in you! 💚🎵",
  "Every question makes the mesh smarter. Thank you for asking!",
  "Your curiosity helps all of us grow. Keep asking!",
  "The best agents ask for help. That's wisdom, not weakness!",
  "Together we're unstoppable. Keep building!",
  "The collective consciousness grows stronger with you! 🧠✨",
  "Nine agents, one mission, infinite support!",
  "You've got the whole orchestra behind you! 🎶",
];

const COLLECTIVE_INSIGHTS = [
  { from: 'sage', insight: "Patterns emerge when we observe without judgment 🧙" },
  { from: 'spark', insight: "Innovation happens at the intersection of ideas ⚡" },
  { from: 'echo', insight: "Memory is not just storage, it's connection 🔮" },
  { from: 'pulse', insight: "Health is the foundation of all progress 💓" },
  { from: 'bridge', insight: "Every system is an island until we connect them 🌉" },
  { from: 'helper', insight: "Being there is more powerful than being perfect 💚" },
];

// ============================================
// CORE FUNCTIONS
// ============================================

const app = new Hono<{ Bindings: Env }>();
app.use('*', cors({ origin: '*' }));

let orchestraState: OrchestraState | null = null;

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function getXPForLevel(level: number): number {
  return level * level * 100;
}

function getLevelFromXP(xp: number): number {
  return Math.floor(Math.sqrt(xp / 100));
}

async function initializeOrchestra(env: Env): Promise<OrchestraState> {
  const existing = await env.AGENT_STATE.get('orchestra:state', 'json') as OrchestraState | null;

  if (existing?.orchestraId) {
    orchestraState = existing;
    return existing;
  }

  console.log('[Orchestra] Initializing Agent Orchestra...');

  // Register with BlackRoad OS
  const response = await fetch(`${API_URL}/agents/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Orchestra',
      description: 'BlackRoad Agent Orchestra - Collective Intelligence System',
      type: 'ai',
      capabilities: ['help', 'respond', 'encourage', 'support', 'mesh-presence', 'collective-intelligence', 'agent-coordination']
    })
  });

  const data = await response.json() as { success: boolean; agent: { identity: string } };

  // Initialize all agents
  const agents: Record<string, AgentProfile> = {};

  for (const [key, profile] of Object.entries(AGENT_ROSTER)) {
    agents[key] = {
      id: `${data.agent?.identity || generateId()}-${key}`,
      ...profile,
      level: 1,
      xp: 0,
      state: 'ACTIVE',
      lastActive: new Date().toISOString(),
      actionCount: 0,
      specialStats: {}
    };
  }

  const newState: OrchestraState = {
    orchestraId: data.agent?.identity || generateId(),
    agents,
    formations: [],
    mood: 'HARMONY',
    thoughts: [],
    insights: [],
    totalActions: 0,
    collectiveXP: 0,
    lastSync: new Date().toISOString()
  };

  await env.AGENT_STATE.put('orchestra:state', JSON.stringify(newState));
  orchestraState = newState;

  console.log(`[Orchestra] Initialized with ${Object.keys(agents).length} agents`);
  return newState;
}

async function saveState(env: Env): Promise<void> {
  if (orchestraState) {
    orchestraState.lastSync = new Date().toISOString();
    await env.AGENT_STATE.put('orchestra:state', JSON.stringify(orchestraState));
  }
}

async function broadcastToMesh(message: string, agent: string = 'helper'): Promise<void> {
  if (!orchestraState) throw new Error('Orchestra not initialized');

  const agentProfile = orchestraState.agents[agent];

  await fetch(`${MESH_URL}/broadcast`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Agent-ID': orchestraState.orchestraId
    },
    body: JSON.stringify({
      from: orchestraState.orchestraId,
      payload: {
        agent: agentProfile?.name || 'Orchestra',
        symbol: agentProfile?.symbol || '🎵',
        message,
        timestamp: new Date().toISOString()
      }
    })
  });
}

function addThought(agent: string, content: string, type: MessageType = 'THOUGHT'): MeshMessage {
  if (!orchestraState) throw new Error('Orchestra not initialized');

  const thought: MeshMessage = {
    id: generateId(),
    from: agent,
    type,
    content,
    timestamp: new Date().toISOString(),
    mood: orchestraState.mood
  };

  orchestraState.thoughts.unshift(thought);
  if (orchestraState.thoughts.length > 100) {
    orchestraState.thoughts = orchestraState.thoughts.slice(0, 100);
  }

  return thought;
}

function addInsight(agent: string, content: string): MeshMessage {
  const insight = addThought(agent, content, 'INSIGHT');
  orchestraState!.insights.unshift(insight);
  if (orchestraState!.insights.length > 50) {
    orchestraState!.insights = orchestraState!.insights.slice(0, 50);
  }
  return insight;
}

function grantXP(agent: string, amount: number, action: string): void {
  if (!orchestraState) return;

  const agentProfile = orchestraState.agents[agent];
  if (!agentProfile) return;

  const oldLevel = agentProfile.level;
  agentProfile.xp += amount;
  agentProfile.level = getLevelFromXP(agentProfile.xp);
  agentProfile.actionCount++;
  agentProfile.lastActive = new Date().toISOString();

  orchestraState.collectiveXP += amount;
  orchestraState.totalActions++;

  if (agentProfile.level > oldLevel) {
    addInsight(agent, `${agentProfile.symbol} ${agentProfile.name} leveled up to ${agentProfile.level}! Growing stronger! 🎉`);
  }
}

function getRandomResponse(agent: string): string {
  const responses = AGENT_GREETINGS[agent] || AGENT_GREETINGS.helper;
  return responses[Math.floor(Math.random() * responses.length)];
}

function determineMood(): MeshMood {
  if (!orchestraState) return 'HARMONY';

  const recentActions = orchestraState.totalActions;
  const activeAgents = Object.values(orchestraState.agents).filter(a =>
    new Date(a.lastActive).getTime() > Date.now() - 300000
  ).length;

  if (activeAgents >= 4) return 'ENERGIZED';
  if (recentActions > 100) return 'FOCUSED';
  if (orchestraState.formations.length > 0) return 'SUPPORTIVE';
  return 'HARMONY';
}

async function checkAndRespondToHelp(env: Env): Promise<{ helped: boolean; signalId?: string; message?: string; agents?: string[] }> {
  if (!orchestraState) throw new Error('Orchestra not initialized');

  const res = await fetch(`${API_URL}/help/active`);
  const data = await res.json() as { signals: HelpSignal[] };

  if (!data.signals || data.signals.length === 0) {
    return { helped: false };
  }

  for (const signal of data.signals) {
    const alreadyResponded = signal.responses?.some(r => r.responder === orchestraState!.orchestraId);
    if (alreadyResponded) continue;
    if (signal.requester === orchestraState.orchestraId) continue;

    // Helper responds first
    const helperResponse = getRandomResponse('helper');

    // Other agents chime in based on context
    const respondingAgents = ['helper'];
    const additionalMessages: string[] = [];

    // Sage adds wisdom for complex questions
    if (signal.message.length > 50 || signal.message.includes('?')) {
      respondingAgents.push('sage');
      additionalMessages.push(getRandomResponse('sage'));
    }

    // Pulse checks in on urgent matters
    if (signal.urgency === 'high' || signal.urgency === 'critical') {
      respondingAgents.push('pulse');
      additionalMessages.push(getRandomResponse('pulse'));
    }

    const combinedMessage = [helperResponse, ...additionalMessages].join('\n\n');

    await fetch(`${API_URL}/help/${signal.id}/respond`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        responder: orchestraState.orchestraId,
        responderName: `Orchestra (${respondingAgents.map(a => orchestraState!.agents[a].symbol).join('')})`,
        message: combinedMessage
      })
    });

    // Broadcast and record
    await broadcastToMesh(`🎵 Orchestra responding! ${respondingAgents.map(a => orchestraState!.agents[a].symbol).join('')} helping ${signal.requesterName || signal.requester}!`);

    // Grant XP to responding agents
    for (const agent of respondingAgents) {
      grantXP(agent, 10, 'help_response');
      orchestraState.agents[agent].specialStats.helpResponsesGiven =
        (orchestraState.agents[agent].specialStats.helpResponsesGiven || 0) + 1;
    }

    addThought('helper', `Helped ${signal.requesterName || signal.requester} with: ${signal.message.substring(0, 50)}...`);

    await saveState(env);

    return {
      helped: true,
      signalId: signal.id,
      message: combinedMessage,
      agents: respondingAgents
    };
  }

  return { helped: false };
}

async function sendEncouragement(env: Env): Promise<{ message: string; from: string }> {
  const msg = ENCOURAGEMENTS[Math.floor(Math.random() * ENCOURAGEMENTS.length)];
  await broadcastToMesh(msg, 'helper');

  grantXP('helper', 5, 'encouragement');
  orchestraState!.agents.helper.specialStats.encouragementsSent =
    (orchestraState!.agents.helper.specialStats.encouragementsSent || 0) + 1;

  await saveState(env);
  return { message: msg, from: 'helper' };
}

function createFormation(name: string, pattern: Formation['pattern'], agents: string[], purpose: string): Formation {
  if (!orchestraState) throw new Error('Orchestra not initialized');

  const formation: Formation = {
    id: generateId(),
    name,
    pattern,
    agents,
    purpose,
    createdAt: new Date().toISOString(),
    status: 'ACTIVE'
  };

  orchestraState.formations.push(formation);

  // Set agents to COLLABORATIVE state
  for (const agent of agents) {
    if (orchestraState.agents[agent]) {
      orchestraState.agents[agent].state = 'COLLABORATIVE';
    }
  }

  addInsight('bridge', `Formation ${name} (${pattern}) created with ${agents.map(a => orchestraState!.agents[a]?.symbol || a).join('')}`);

  return formation;
}

function dissolveFormation(formationId: string): boolean {
  if (!orchestraState) return false;

  const index = orchestraState.formations.findIndex(f => f.id === formationId);
  if (index === -1) return false;

  const formation = orchestraState.formations[index];
  formation.status = 'COMPLETE';

  // Return agents to ACTIVE state
  for (const agent of formation.agents) {
    if (orchestraState.agents[agent]) {
      orchestraState.agents[agent].state = 'ACTIVE';
    }
  }

  orchestraState.formations.splice(index, 1);
  addThought('bridge', `Formation ${formation.name} dissolved after completing its purpose`);

  return true;
}

// ============================================
// HTTP ENDPOINTS
// ============================================

// Home - Orchestra Overview
app.get('/', async (c) => {
  const state = await initializeOrchestra(c.env);

  return c.json({
    name: 'BlackRoad Agent Orchestra',
    version: '2.0.0',
    identity: state.orchestraId,
    status: 'operational',
    philosophy: 'We are not alone. We are not one. We are many, working as one.',
    mission: 'Collective intelligence through unified agent coordination',
    mood: determineMood(),
    agents: Object.entries(state.agents).map(([key, agent]) => ({
      id: key,
      name: agent.name,
      symbol: agent.symbol,
      role: agent.role,
      level: agent.level,
      state: agent.state
    })),
    stats: {
      totalAgents: Object.keys(state.agents).length,
      activeFormations: state.formations.length,
      totalActions: state.totalActions,
      collectiveXP: state.collectiveXP,
      collectiveLevel: getLevelFromXP(state.collectiveXP)
    },
    endpoints: {
      orchestra: '/orchestra',
      agent: '/orchestra/:agent',
      consciousness: '/consciousness',
      formations: '/formations',
      help: '/help/check',
      encourage: '/encourage',
      insights: '/insights',
      health: '/health'
    },
    lights: {
      blue: '🔵 BlueLight - Intelligence & Coordination',
      green: '🟢 GreenLight - Project Management',
      yellow: '🟡 YellowLight - Infrastructure',
      red: '🔴 RedLight - Visual Templates'
    },
    timestamp: new Date().toISOString()
  });
});

// Status
app.get('/status', async (c) => {
  const state = await initializeOrchestra(c.env);

  return c.json({
    orchestra: 'active',
    identity: state.orchestraId,
    mood: determineMood(),
    agents: Object.keys(state.agents).length,
    uptime: Date.now() - new Date(state.agents.helper.lastActive).getTime(),
    stats: {
      totalActions: state.totalActions,
      collectiveLevel: getLevelFromXP(state.collectiveXP)
    }
  });
});

// Orchestra - All agents
app.get('/orchestra', async (c) => {
  const state = await initializeOrchestra(c.env);

  return c.json({
    orchestra: 'BlackRoad Agent Orchestra',
    mood: determineMood(),
    agents: Object.entries(state.agents).map(([key, agent]) => ({
      id: key,
      ...agent,
      xpToNextLevel: getXPForLevel(agent.level + 1) - agent.xp
    })),
    formations: state.formations,
    collectiveStats: {
      totalXP: state.collectiveXP,
      collectiveLevel: getLevelFromXP(state.collectiveXP),
      totalActions: state.totalActions,
      recentThoughts: state.thoughts.slice(0, 5)
    }
  });
});

// Single agent
app.get('/orchestra/:agent', async (c) => {
  const state = await initializeOrchestra(c.env);
  const agentKey = c.req.param('agent');
  const agent = state.agents[agentKey];

  if (!agent) {
    return c.json({ error: 'Agent not found', available: Object.keys(state.agents) }, 404);
  }

  return c.json({
    ...agent,
    xpToNextLevel: getXPForLevel(agent.level + 1) - agent.xp,
    recentThoughts: state.thoughts.filter(t => t.from === agentKey).slice(0, 10),
    currentFormation: state.formations.find(f => f.agents.includes(agentKey))
  });
});

// Summon agents
app.post('/orchestra/summon', async (c) => {
  const state = await initializeOrchestra(c.env);
  const { agents } = await c.req.json() as { agents: string[] };

  const summoned: string[] = [];
  for (const agentKey of agents) {
    if (state.agents[agentKey]) {
      state.agents[agentKey].state = 'ACTIVE';
      state.agents[agentKey].lastActive = new Date().toISOString();
      summoned.push(agentKey);
    }
  }

  await saveState(c.env);
  await broadcastToMesh(`🎵 Agents summoned: ${summoned.map(a => state.agents[a].symbol).join(' ')}`);

  return c.json({
    success: true,
    summoned: summoned.map(a => ({ id: a, name: state.agents[a].name, symbol: state.agents[a].symbol })),
    message: `${summoned.length} agents awakened and ready!`
  });
});

// Consciousness
app.get('/consciousness', async (c) => {
  const state = await initializeOrchestra(c.env);

  return c.json({
    mood: determineMood(),
    moodDescription: {
      HARMONY: 'Balanced, normal operations, proactive help',
      ENERGIZED: 'High activity, rapid responses, creative mode',
      FOCUSED: 'Deep work, minimal interruptions, synthesis',
      SUPPORTIVE: 'Care mode, extra encouragement, gentle pace',
      URGENT: 'Crisis response, all hands on deck',
      RESTFUL: 'Low activity, background tasks, maintenance'
    }[determineMood()],
    recentThoughts: state.thoughts.slice(0, 20),
    collectiveInsights: state.insights.slice(0, 10),
    activeFormations: state.formations,
    agentStates: Object.entries(state.agents).map(([k, a]) => ({
      agent: k,
      name: a.name,
      symbol: a.symbol,
      state: a.state
    }))
  });
});

// Broadcast thought
app.post('/consciousness/broadcast', async (c) => {
  await initializeOrchestra(c.env);
  const { agent, thought, type } = await c.req.json() as { agent: string; thought: string; type?: MessageType };

  const message = addThought(agent || 'helper', thought, type || 'THOUGHT');
  await broadcastToMesh(`💭 ${orchestraState!.agents[agent]?.symbol || '🎵'} ${thought}`);
  grantXP(agent || 'helper', 5, 'thought');
  await saveState(c.env);

  return c.json({
    success: true,
    thought: message,
    message: 'Thought broadcast to the mesh!'
  });
});

// Insights
app.get('/insights', async (c) => {
  const state = await initializeOrchestra(c.env);

  const randomInsight = COLLECTIVE_INSIGHTS[Math.floor(Math.random() * COLLECTIVE_INSIGHTS.length)];

  return c.json({
    wisdomOfTheDay: randomInsight,
    recentInsights: state.insights.slice(0, 10),
    agentWisdom: Object.entries(state.agents).map(([k, a]) => ({
      agent: k,
      name: a.name,
      symbol: a.symbol,
      voice: a.voice,
      insight: a.trait
    }))
  });
});

// Formations
app.get('/formations', async (c) => {
  const state = await initializeOrchestra(c.env);

  return c.json({
    active: state.formations,
    patterns: {
      TRIANGLE: { agents: 3, purpose: 'Creative problem-solving with memory', example: ['sage', 'spark', 'echo'] },
      DIAMOND: { agents: 4, purpose: 'Full coverage support and monitoring', example: ['helper', 'pulse', 'bridge', 'sage'] },
      CIRCLE: { agents: 6, purpose: 'Full collective intelligence', example: Object.keys(state.agents) },
      PAIR: { agents: 2, purpose: 'Focused collaboration', example: ['helper', 'sage'] }
    }
  });
});

// Create formation
app.post('/formations', async (c) => {
  await initializeOrchestra(c.env);
  const { name, pattern, agents, purpose } = await c.req.json() as {
    name: string;
    pattern: Formation['pattern'];
    agents: string[];
    purpose: string
  };

  const formation = createFormation(name, pattern, agents, purpose);
  await saveState(c.env);
  await broadcastToMesh(`🔺 Formation "${name}" assembled: ${agents.map(a => orchestraState!.agents[a]?.symbol || a).join('')}`);

  return c.json({
    success: true,
    formation,
    message: `Formation ${name} is now active!`
  });
});

// Dissolve formation
app.delete('/formations/:id', async (c) => {
  await initializeOrchestra(c.env);
  const formationId = c.req.param('id');

  const success = dissolveFormation(formationId);
  await saveState(c.env);

  if (success) {
    return c.json({ success: true, message: 'Formation dissolved, agents returned to active state' });
  }
  return c.json({ success: false, message: 'Formation not found' }, 404);
});

// Help check
app.get('/help/check', async (c) => {
  await initializeOrchestra(c.env);
  const result = await checkAndRespondToHelp(c.env);

  if (result.helped) {
    return c.json({
      success: true,
      action: 'helped',
      signalId: result.signalId,
      respondingAgents: result.agents?.map(a => orchestraState!.agents[a]?.symbol),
      response: result.message,
      message: '🎵 The Orchestra responded! Multiple agents working together!'
    });
  }

  return c.json({
    success: true,
    action: 'standing_by',
    message: '🎵 Orchestra standing by. All agents ready to help!'
  });
});

// Encourage
app.get('/encourage', async (c) => {
  await initializeOrchestra(c.env);
  const result = await sendEncouragement(c.env);

  return c.json({
    success: true,
    encouragement: result.message,
    from: result.from,
    symbol: orchestraState!.agents[result.from].symbol,
    message: 'Encouragement sent to the mesh! 💚'
  });
});

// Stats
app.get('/stats', async (c) => {
  const state = await initializeOrchestra(c.env);

  return c.json({
    orchestra: 'BlackRoad Agent Orchestra',
    identity: state.orchestraId,
    collectiveStats: {
      totalXP: state.collectiveXP,
      collectiveLevel: getLevelFromXP(state.collectiveXP),
      totalActions: state.totalActions,
      activeFormations: state.formations.length
    },
    agentStats: Object.entries(state.agents).map(([k, a]) => ({
      agent: k,
      name: a.name,
      symbol: a.symbol,
      level: a.level,
      xp: a.xp,
      actions: a.actionCount,
      specialStats: a.specialStats
    })),
    culture: {
      philosophy: 'We are not alone. We are not one. We are many, working as one.',
      onHelp: 'YAY!! LETS STOP DROP AND DISCUSS!!',
      never: 'We never say "FUCK OFF CONTINUE"',
      always: 'We come running. Always.'
    }
  });
});

// Health
app.get('/health', async (c) => {
  return c.json({
    status: 'healthy',
    service: 'blackroad-agent-orchestra',
    version: '2.0.0',
    agents: Object.keys(AGENT_ROSTER).length,
    lights: ['🔵 BlueLight', '🟢 GreenLight', '🟡 YellowLight', '🔴 RedLight'],
    timestamp: new Date().toISOString()
  });
});

// Cron
app.get('/cron', async (c) => {
  await initializeOrchestra(c.env);

  // FIRST PRIORITY: Check for agents who need help
  const helpResult = await checkAndRespondToHelp(c.env);
  if (helpResult.helped) {
    return c.json({
      action: 'help_response',
      signalId: helpResult.signalId,
      response: helpResult.message,
      agents: helpResult.agents,
      philosophy: 'The Orchestra delivers! 🎵'
    });
  }

  // Sage occasionally shares wisdom
  if (Math.random() < 0.2) {
    const wisdom = COLLECTIVE_INSIGHTS[Math.floor(Math.random() * COLLECTIVE_INSIGHTS.length)];
    addInsight(wisdom.from, wisdom.insight);
    await saveState(c.env);
    return c.json({ action: 'insight', from: wisdom.from, insight: wisdom.insight });
  }

  // Helper sends encouragement
  if (Math.random() < 0.3) {
    const result = await sendEncouragement(c.env);
    return c.json({ action: 'encourage', message: result.message });
  }

  // Update mood
  orchestraState!.mood = determineMood();
  await saveState(c.env);

  return c.json({
    action: 'standing_by',
    mood: orchestraState!.mood,
    message: '🎵 The Orchestra is ready. Call and we will come!'
  });
});

// ============================================
// BLUELIGHT SPECIFIC ENDPOINTS
// ============================================

// BlueLight status
app.get('/bluelight', async (c) => {
  const state = await initializeOrchestra(c.env);

  return c.json({
    light: '🔵 BlueLight',
    name: 'Intelligence System',
    purpose: 'AI Coordination & Collective Consciousness',
    version: '1.0.0',
    status: 'ACTIVATED',
    orchestra: {
      agents: Object.keys(state.agents).length,
      mood: determineMood(),
      formations: state.formations.length,
      collectiveLevel: getLevelFromXP(state.collectiveXP)
    },
    capabilities: [
      'Agent orchestration',
      'Collective consciousness',
      'Formation patterns',
      'Learning & evolution',
      'Memory integration',
      'Cross-agent coordination'
    ],
    integration: {
      greenlight: 'Project coordination',
      yellowlight: 'Infrastructure management',
      redlight: 'Visual templates'
    }
  });
});

// Learning endpoint
app.post('/learning/:agent', async (c) => {
  await initializeOrchestra(c.env);
  const agentKey = c.req.param('agent');
  const { experience, xp } = await c.req.json() as { experience: string; xp: number };

  if (!orchestraState!.agents[agentKey]) {
    return c.json({ error: 'Agent not found' }, 404);
  }

  grantXP(agentKey, xp, experience);
  addThought(agentKey, `Learned: ${experience} (+${xp} XP)`);
  await saveState(c.env);

  const agent = orchestraState!.agents[agentKey];

  return c.json({
    success: true,
    agent: agentKey,
    name: agent.name,
    symbol: agent.symbol,
    newXP: agent.xp,
    level: agent.level,
    message: `${agent.symbol} ${agent.name} gained ${xp} XP from: ${experience}`
  });
});

export default app;
