import { useState, useEffect } from 'react';
import {
  Person,
  LifeTask,
  LifeSharedFinance,
  InsurancePolicy,
  LifeDocument,
  ImportantDate,
  LifeEvent,
  LifeAsset
} from '../../types';
import {
  INITIAL_PEOPLE,
  INITIAL_TASKS,
  INITIAL_SHARED_FINANCE,
  INITIAL_INSURANCE,
  INITIAL_DOCUMENTS,
  INITIAL_IMPORTANT_DATES,
  INITIAL_LIFE_EVENTS,
  INITIAL_LIFE_ASSETS
} from '../../data/myLifeData';

const LOCAL_STORAGE_KEY = 'my_life_system_data_v1';

export function useMyLifeStore() {
  const [people, setPeople] = useState<Person[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_people`);
    return saved ? JSON.parse(saved) : INITIAL_PEOPLE;
  });

  const [tasks, setTasks] = useState<LifeTask[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_tasks`);
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [sharedFinances, setSharedFinances] = useState<LifeSharedFinance[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_finances`);
    return saved ? JSON.parse(saved) : INITIAL_SHARED_FINANCE;
  });

  const [insurances, setInsurances] = useState<InsurancePolicy[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_insurances`);
    return saved ? JSON.parse(saved) : INITIAL_INSURANCE;
  });

  const [documents, setDocuments] = useState<LifeDocument[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_documents`);
    return saved ? JSON.parse(saved) : INITIAL_DOCUMENTS;
  });

  const [importantDates, setImportantDates] = useState<ImportantDate[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_dates`);
    return saved ? JSON.parse(saved) : INITIAL_IMPORTANT_DATES;
  });

  const [lifeEvents, setLifeEvents] = useState<LifeEvent[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_events`);
    return saved ? JSON.parse(saved) : INITIAL_LIFE_EVENTS;
  });

  const [assets, setAssets] = useState<LifeAsset[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_assets`);
    return saved ? JSON.parse(saved) : INITIAL_LIFE_ASSETS;
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_people`, JSON.stringify(people));
  }, [people]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_tasks`, JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_finances`, JSON.stringify(sharedFinances));
  }, [sharedFinances]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_insurances`, JSON.stringify(insurances));
  }, [insurances]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_documents`, JSON.stringify(documents));
  }, [documents]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_dates`, JSON.stringify(importantDates));
  }, [importantDates]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_events`, JSON.stringify(lifeEvents));
  }, [lifeEvents]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_assets`, JSON.stringify(assets));
  }, [assets]);

  // Handlers for People
  const addPerson = (person: Omit<Person, 'id' | 'createdAt'>) => {
    const newP: Person = {
      ...person,
      id: `p-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setPeople((prev) => [newP, ...prev]);
    return newP;
  };

  const updatePerson = (id: string, updated: Partial<Person>) => {
    setPeople((prev) => prev.map((p) => (p.id === id ? { ...p, ...updated } : p)));
  };

  const deletePerson = (id: string) => {
    setPeople((prev) => prev.filter((p) => p.id !== id));
    // Also remove reference from tasks, finances, docs etc.
    setTasks((prev) =>
      prev.map((t) => ({ ...t, personIds: t.personIds.filter((pid) => pid !== id) }))
    );
  };

  // Handlers for Tasks
  const addTask = (task: Omit<LifeTask, 'id' | 'createdAt'>) => {
    const newT: LifeTask = {
      ...task,
      id: `t-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setTasks((prev) => [newT, ...prev]);
    return newT;
  };

  const updateTaskStatus = (id: string, status: LifeTask['status']) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  // Handlers for Shared Finance
  const addSharedFinance = (finance: Omit<LifeSharedFinance, 'id' | 'updatedAt'>) => {
    const newSF: LifeSharedFinance = {
      ...finance,
      id: `sf-${Date.now()}`,
      updatedAt: new Date().toISOString()
    };
    setSharedFinances((prev) => [newSF, ...prev]);
    return newSF;
  };

  const deleteSharedFinance = (id: string) => {
    setSharedFinances((prev) => prev.filter((sf) => sf.id !== id));
  };

  // Handlers for Insurance
  const addInsurance = (ins: Omit<InsurancePolicy, 'id'>) => {
    const newIns: InsurancePolicy = {
      ...ins,
      id: `ins-${Date.now()}`
    };
    setInsurances((prev) => [newIns, ...prev]);
    return newIns;
  };

  const deleteInsurance = (id: string) => {
    setInsurances((prev) => prev.filter((i) => i.id !== id));
  };

  // Handlers for Documents
  const addDocument = (doc: Omit<LifeDocument, 'id'>) => {
    const newDoc: LifeDocument = {
      ...doc,
      id: `doc-${Date.now()}`
    };
    setDocuments((prev) => [newDoc, ...prev]);
    return newDoc;
  };

  const deleteDocument = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  // Handlers for Dates
  const addImportantDate = (dateItem: Omit<ImportantDate, 'id'>) => {
    const newD: ImportantDate = {
      ...dateItem,
      id: `id-${Date.now()}`
    };
    setImportantDates((prev) => [...prev, newD]);
    return newD;
  };

  const deleteImportantDate = (id: string) => {
    setImportantDates((prev) => prev.filter((d) => d.id !== id));
  };

  // Handlers for Events
  const addLifeEvent = (eventItem: Omit<LifeEvent, 'id'>) => {
    const newE: LifeEvent = {
      ...eventItem,
      id: `le-${Date.now()}`
    };
    setLifeEvents((prev) => [newE, ...prev]);
    return newE;
  };

  const deleteLifeEvent = (id: string) => {
    setLifeEvents((prev) => prev.filter((e) => e.id !== id));
  };

  // Handlers for Assets
  const addAsset = (assetItem: Omit<LifeAsset, 'id'>) => {
    const newA: LifeAsset = {
      ...assetItem,
      id: `ast-${Date.now()}`
    };
    setAssets((prev) => [newA, ...prev]);
    return newA;
  };

  const deleteAsset = (id: string) => {
    setAssets((prev) => prev.filter((a) => a.id !== id));
  };

  const resetToSeedData = () => {
    setPeople(INITIAL_PEOPLE);
    setTasks(INITIAL_TASKS);
    setSharedFinances(INITIAL_SHARED_FINANCE);
    setInsurances(INITIAL_INSURANCE);
    setDocuments(INITIAL_DOCUMENTS);
    setImportantDates(INITIAL_IMPORTANT_DATES);
    setLifeEvents(INITIAL_LIFE_EVENTS);
    setAssets(INITIAL_LIFE_ASSETS);
  };

  return {
    people,
    tasks,
    sharedFinances,
    insurances,
    documents,
    importantDates,
    lifeEvents,
    assets,
    addPerson,
    updatePerson,
    deletePerson,
    addTask,
    updateTaskStatus,
    deleteTask,
    addSharedFinance,
    deleteSharedFinance,
    addInsurance,
    deleteInsurance,
    addDocument,
    deleteDocument,
    addImportantDate,
    deleteImportantDate,
    addLifeEvent,
    deleteLifeEvent,
    addAsset,
    deleteAsset,
    resetToSeedData
  };
}
