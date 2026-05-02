'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import axios from 'axios';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

// Extend Axios types to include metadata
declare module 'axios' {
  interface InternalAxiosRequestConfig {
    metadata?: {
      startTime?: number;
    };
  }
}

type RiskStatus = 'High' | 'Moderate' | 'Low';

// ART Medication options
const ART_MEDICATIONS = [
  'Lamivudine',
  'Zidovudine',
  'Tenofovir',
  'Darunavir',
  'Dolutegravir',
  'Abacavir'
];

type Patient = {
  id: string;
  name: string;
  age: number;
  sex: number; // 0=Female, 1=Male
  weight: number; // in kg
  height: number; // in cm
  yearsOnART: number;
  bpHistory: boolean;
  exercise: boolean;
  medications: string[];
  status: RiskStatus;
  probability: number;
  lastCheckup: string;
  recommendations: string[];
};

type ApiResponse = {
  patientId: string;
  patientName: string;
  riskLevel: RiskStatus;
  probability: number;
  riskScore: string;
  prediction: string;
  recommendations: string[];
  timestamp: string;
  inputFeatures: any;
  modelUsed: string;
};

const api = axios.create({
  // baseURL: 'http://127.0.0.1:5001', 
  baseURL: 'https://art-hypertesion-predictor-backend.onrender.com',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptors for better error handling
api.interceptors.request.use(config => {
  config.metadata = { startTime: new Date().getTime() };
  return config;
});

api.interceptors.response.use(
  response => {
    const endTime = new Date().getTime();
    const duration = endTime - (response.config.metadata?.startTime || endTime);
    console.log(`Request to ${response.config.url} took ${duration}ms`);
    return response;
  },
  error => {
    if (error.code === 'ECONNABORTED') {
      console.error('Request timed out:', error.config.url);
    }
    return Promise.reject(error);
  }
);

export default function Dashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'home' | 'test'>('home');
  // const [patientData, setPatientData] = useState({
  //   name: '',
  //   age: 35,
  //   sex: 1, // Default to Male
  //   weight: 70,
  //   height: 170,
  //   yearsOnART: 5,
  //   bpHistory: false,
  //   exercise: true,
  //   medications: [] as string[]
  // });
  const [patientData, setPatientData] = useState({
    name: '',
    age: '',
    sex: 1, // Keep sex default since it's a select
    weight: '',
    height: '',
    yearsOnART: '',
    bpHistory: false,
    exercise: true,
    medications: [] as string[]
  });
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [showAllPatients, setShowAllPatients] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | RiskStatus>('All');


  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || patient.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  useEffect(() => {
    const savedPatients = localStorage.getItem('art-patients');
    if (savedPatients) {
      try {
        setPatients(JSON.parse(savedPatients));
      } catch (err) {
        console.error('Error parsing patient data:', err);
      }
    }
  }, []);

  // const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  //   const { name, value, type } = e.target;

  //   if (type === 'checkbox') {
  //     const checkbox = e.target as HTMLInputElement;
  //     setPatientData(prev => ({
  //       ...prev,
  //       [name]: checkbox.checked
  //     }));
  //   } else {
  //     setPatientData(prev => ({
  //       ...prev,
  //       [name]: ['age', 'weight', 'height', 'yearsOnART'].includes(name)
  //         ? Number(value)
  //         : value
  //     }));
  //   }
  // };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setPatientData(prev => ({
        ...prev,
        [name]: checkbox.checked
      }));
      return;
    }

    // For text inputs (like name), allow empty string
    if (name === 'name') {
      setPatientData(prev => ({
        ...prev,
        [name]: value
      }));
      return;
    }

    // Handle number inputs - ALLOW EMPTY STRING for all number fields temporarily
    if (value === '') {
      setPatientData(prev => ({
        ...prev,
        [name]: ''  // Allow empty temporarily
      }));
      return;
    }

    // Convert to number for numeric fields
    setPatientData(prev => ({
      ...prev,
      [name]: ['age', 'weight', 'height', 'yearsOnART'].includes(name)
        ? Number(value)
        : value
    }));
  };

  const handleMedicationChange = (medication: string) => {
    setPatientData(prev => {
      const newMedications = prev.medications.includes(medication)
        ? prev.medications.filter(m => m !== medication)
        : [...prev.medications, medication];

      return {
        ...prev,
        medications: newMedications
      };
    });
  };

  const validateName = (name: string): boolean => {
    // Allows letters (including accented), spaces, hyphens, and apostrophes
    const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/;
    return nameRegex.test(name);
  };

  const preventInvalidNumber = (e: React.KeyboardEvent<HTMLInputElement>, min: number, max: number) => {
    const { key, currentTarget } = e;
    const currentValue = currentTarget.value;

    // Allow backspace, delete, tab, enter, escape, arrow keys
    if (key === 'Backspace' || key === 'Delete' || key === 'Tab' ||
      key === 'Enter' || key === 'Escape' || key === 'ArrowLeft' ||
      key === 'ArrowRight' || key === 'ArrowUp' || key === 'ArrowDown') {
      return;
    }

    // Allow control keys (Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X)
    if (e.ctrlKey && ['a', 'c', 'v', 'x'].includes(key.toLowerCase())) {
      return;
    }

    // Prevent if not a number key
    if (!/^[0-9]$/.test(key)) {
      e.preventDefault();
      return;
    }

    // Build the new value
    const newValue = currentValue + key;

    // PREVENT RIDICULOUSLY LONG NUMBERS
    if (newValue.length > 3) {
      e.preventDefault();
      return;
    }

    const numValue = parseInt(newValue, 10);

    // Check if it's too big
    if (numValue > max) {
      e.preventDefault();
      return;
    }

    // For height, let them type any number up to max
    // The validateForm will catch values below min on submit

  };

  // const preventInvalidNumber = (e: React.KeyboardEvent<HTMLInputElement>, min: number, max: number) => {
  //   const { key, currentTarget } = e;
  //   const currentValue = currentTarget.value;

  //   // Allow backspace, delete, tab, enter, escape, arrow keys
  //   if (key === 'Backspace' || key === 'Delete' || key === 'Tab' ||
  //     key === 'Enter' || key === 'Escape' || key === 'ArrowLeft' ||
  //     key === 'ArrowRight' || key === 'ArrowUp' || key === 'ArrowDown') {
  //     return;
  //   }

  //   // Allow control keys (Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X)
  //   if (e.ctrlKey && ['a', 'c', 'v', 'x'].includes(key.toLowerCase())) {
  //     return;
  //   }

  //   // Prevent if not a number key (NO DECIMAL for height since it's whole cm)
  //   if (!/^[0-9]$/.test(key)) {
  //     e.preventDefault();
  //     return;
  //   }

  //   // Build the new value
  //   const newValue = currentValue + key;
  //   const numValue = parseInt(newValue, 10);

  //   // Check max first - this should always block
  //   if (numValue > max) {
  //     e.preventDefault();
  //     return;
  //   }

  //   // SPECIAL HANDLING FOR HEIGHT (min = 30)
  //   if (min === 30) {
  //     // Allow single digits: "3" is fine (will become 30-39), "2" is fine (will become 20-29 but will be blocked later if <30)
  //     // Actually, allow any first digit 1-9
  //     if (newValue.length === 1) {
  //       return; // Always allow first digit
  //     }

  //     // For 2 or more digits, check if it's below minimum
  //     if (newValue.length >= 2 && numValue < min) {
  //       e.preventDefault();
  //       return;
  //     }
  //   }

  //   // SPECIAL HANDLING FOR WEIGHT (min = 1.5)
  //   else if (min === 1.5) {
  //     // Handle decimal logic
  //     if (key === '.') {
  //       if (currentValue.includes('.')) {
  //         e.preventDefault();
  //         return;
  //       }
  //       return;
  //     }

  //     // For weight, let it build naturally - validation will catch on submit
  //     // Only block if it's clearly too big
  //     if (numValue > max) {
  //       e.preventDefault();
  //       return;
  //     }
  //   }

  //   // SPECIAL HANDLING FOR AGE (min = 0, max = 125)
  //   else if (min === 0 && max === 125) {
  //     if (newValue.length === 1) {
  //       // First digit can be 0-1
  //       if (parseInt(key) > 1) {
  //         e.preventDefault();
  //         return;
  //       }
  //     }
  //     if (newValue.length >= 2 && numValue > max) {
  //       e.preventDefault();
  //       return;
  //     }
  //   }

  //   // SPECIAL HANDLING FOR YEARS ON ART (min = 0, max = 120)
  //   else if (min === 0 && max === 120) {
  //     if (newValue.length === 1) {
  //       // First digit can be 0-1
  //       if (parseInt(key) > 1) {
  //         e.preventDefault();
  //         return;
  //       }
  //     }
  //     if (newValue.length >= 2 && numValue > max) {
  //       e.preventDefault();
  //       return;
  //     }
  //   }
  // };

  // const preventInvalidNumber = (e: React.KeyboardEvent<HTMLInputElement>, min: number, max: number) => {
  //   const { key, currentTarget } = e;
  //   const currentValue = currentTarget.value;

  //   // Allow backspace, delete, tab, enter, escape, arrow keys
  //   if (key === 'Backspace' || key === 'Delete' || key === 'Tab' ||
  //     key === 'Enter' || key === 'Escape' || key === 'ArrowLeft' ||
  //     key === 'ArrowRight' || key === 'ArrowUp' || key === 'ArrowDown') {
  //     return;
  //   }

  //   // Allow control keys (Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X)
  //   if (e.ctrlKey && ['a', 'c', 'v', 'x'].includes(key.toLowerCase())) {
  //     return;
  //   }

  //   // Prevent if not a number key or decimal point
  //   if (!/^[0-9.]$/.test(key)) {
  //     e.preventDefault();
  //     return;
  //   }

  //   // Prevent multiple decimal points
  //   if (key === '.' && currentValue.includes('.')) {
  //     e.preventDefault();
  //     return;
  //   }

  //   // Build the new value
  //   const newValue = currentValue + key;

  //   // Allow empty or incomplete numbers during typing
  //   if (newValue === '' || newValue === '.') {
  //     return;
  //   }

  //   const numValue = parseFloat(newValue);

  //   if (isNaN(numValue)) {
  //     e.preventDefault();
  //     return;
  //   }

  //   // Only block if the number is DEFINITELY too large
  //   // This allows typing "2" then "5" then "0" to reach 250
  //   if (numValue > max) {
  //     e.preventDefault();
  //     return;
  //   }

  //   // For min checks, only block if we have a complete number that's too small
  //   // This allows typing "1" then "." then "5" to reach 1.5
  //   if (min > 0 && numValue < min && newValue.length >= String(min).length) {
  //     // Check if we're still building the number
  //     const minStr = String(min);
  //     if (newValue.length === minStr.length && newValue < minStr) {
  //       e.preventDefault();
  //       return;
  //     }
  //   }
  // };

  // const validateForm = () => {
  //   const errors = [];

  //   if (!patientData.name) errors.push("Patient name is required");
  //   if (patientData.age < 0 || patientData.age > 120) errors.push("Age must be between 0 and 120 years");
  //   if (patientData.weight < 1.5 || patientData.weight > 250) errors.push("Weight must be between 1.5 and 250 kg");
  //   if (patientData.height < 30 || patientData.height > 250) errors.push("Height must be between 30 and 250 cm");
  //   if (patientData.yearsOnART < 0 || patientData.yearsOnART > 120) errors.push("Years on ART must be between 0 and 120");

  //   return errors;
  // };

  // const validateForm = () => {
  //   const errors = [];

  //   if (!patientData.name) {
  //     errors.push("Patient name is required");
  //   } else if (!validateName(patientData.name)) {
  //     errors.push("Patient name can only contain letters, spaces, hyphens, and apostrophes");
  //   }

  //   if (patientData.age < 0 || patientData.age > 120) errors.push("Age must be between 0 and 120 years");
  //   if (patientData.weight < 1.5 || patientData.weight > 250) errors.push("Weight must be between 1.5 and 250 kg");
  //   if (patientData.height < 30 || patientData.height > 250) errors.push("Height must be between 30 and 250 cm");
  //   if (patientData.yearsOnART < 0 || patientData.yearsOnART > 120) errors.push("Years on ART must be between 0 and 120");

  //   return errors;
  // };

  const validateForm = () => {
    const errors = [];

    if (!patientData.name) {
      errors.push("Patient name is required");
    } else if (!validateName(patientData.name)) {
      errors.push("Patient name can only contain letters, spaces, hyphens, and apostrophes");
    }

    // Convert string values to numbers for comparison
    const age = patientData.age === '' ? null : Number(patientData.age);
    const weight = patientData.weight === '' ? null : Number(patientData.weight);
    const height = patientData.height === '' ? null : Number(patientData.height);
    const yearsOnART = patientData.yearsOnART === '' ? null : Number(patientData.yearsOnART);

    // Age validation
    if (age === null) {
      errors.push("Age is required");
    } else if (age < 0 || age > 125) {
      errors.push("Age must be between 0 and 125 years");
    }

    // Weight validation
    if (weight === null) {
      errors.push("Weight is required");
    } else if (weight < 1.5 || weight > 270) {
      errors.push("Weight must be between 1.5 and 270 kg");
    }

    // Height validation
    if (height === null) {
      errors.push("Height is required");
    } else if (height < 30 || height > 270) {
      errors.push("Height must be between 30 and 270 cm");
    }

    // Years on ART validation
    if (yearsOnART === null) {
      errors.push("Years on ART is required");
    } else if (yearsOnART < 0 || yearsOnART > 120) {
      errors.push("Years on ART must be between 0 and 120");
    }

    return errors;
  };

  // Calculate BMI from weight and height
  // const calculateBMI = (weight: number, height: number): number => {
  //   // height in cm, convert to meters
  //   const heightInMeters = height / 100;
  //   return Number((weight / (heightInMeters * heightInMeters)).toFixed(1));
  // };

  // Calculate BMI from weight and height
  const calculateBMI = (weight: number | string, height: number | string): number => {
    // Return 0 if either value is empty
    if (weight === '' || height === '') return 0;

    // Convert to numbers
    const w = typeof weight === 'string' ? parseFloat(weight) : weight;
    const h = typeof height === 'string' ? parseFloat(height) : height;

    // height in cm, convert to meters
    const heightInMeters = h / 100;
    return Number((w / (heightInMeters * heightInMeters)).toFixed(1));
  };

  // Get BMI category encoded (0=Underweight, 1=Normal, 2=Overweight, 3=Obese)
  const getBMICategory = (bmi: number): number => {
    if (bmi < 18.5) return 0;
    if (bmi < 25) return 1;
    if (bmi < 30) return 2;
    return 3;
  };

  // Get age group encoded (0=<30, 1=30-40, 2=40-50, 3=50-60, 4=60+)
  const getAgeGroup = (age: number): number => {
    if (age < 30) return 0;
    if (age < 40) return 1;
    if (age < 50) return 2;
    if (age < 60) return 3;
    return 4;
  };

  // Map medication names to encoded values (1 if present, 0 if not)
  const getMedicationEncoded = (medications: string[], medicationName: string): number => {
    return medications.includes(medicationName) ? 1 : 0;
  };

  // const predictRisk = async () => {
  //   const validationErrors = validateForm();
  //   if (validationErrors.length > 0) {
  //     setError(validationErrors.join(". "));
  //     return null;
  //   }

  //   setLoading(true);
  //   setError(null);

  //   try {
  //     const bmi = calculateBMI(patientData.weight, patientData.height);
  //     const bmiCategory = getBMICategory(bmi);
  //     const ageGroup = getAgeGroup(patientData.age);

  //     // Prepare data for the API
  //     const apiData = {
  //       patientId: `ART-${Date.now()}`,
  //       name: patientData.name,
  //       AGE: patientData.age,
  //       SEX_ENCODED: patientData.sex,
  //       'BODY MASS INDEX': bmi,
  //       'YEARS ON ART': patientData.yearsOnART,
  //       'BP HISTORY': patientData.bpHistory ? 1 : 0,
  //       'EXERCISES': patientData.exercise ? 1 : 0,
  //       'BMI_CAT_ENCODED': bmiCategory,
  //       'AGE_GROUP_ENCODED': ageGroup,
  //       'TENOFOVIR': getMedicationEncoded(patientData.medications, 'Tenofovir'),
  //       'LAMIVUDINE': getMedicationEncoded(patientData.medications, 'Lamivudine'),
  //       'DOLUTEGRAVIR': getMedicationEncoded(patientData.medications, 'Dolutegravir'),
  //       'DARUNAVIR': getMedicationEncoded(patientData.medications, 'Darunavir'),
  //       'ZIDOVUDINE': getMedicationEncoded(patientData.medications, 'Zidovudine'),
  //       'ABACAVIR': getMedicationEncoded(patientData.medications, 'Abacavir')
  //     };

  //     console.log('Sending data to API:', apiData);

  //     // Send request to backend
  //     const response = await api.post('/api/predict', apiData);

  //     // Save the response
  //     setApiResponse(response.data);
  //     savePatient(response.data, patientData, bmi);
  //     setRetryCount(0);
  //     return response.data;
  //   } catch (err: any) {
  //     console.error('Error:', err);

  //     // Handle specific error cases
  //     if (err.response) {
  //       if (err.response.data && err.response.data.details) {
  //         setError(err.response.data.details);
  //       } else {
  //         setError(err.response.data?.message || 'An error occurred');
  //       }
  //     } else if (err.request) {
  //       setError('No response from server. Please check your connection.');
  //     } else {
  //       setError('An unexpected error occurred');
  //     }

  //     // Retry logic
  //     if (retryCount < 2) {
  //       setRetryCount(prev => prev + 1);
  //       await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
  //       return predictRisk();
  //     }

  //     return null;
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const predictRisk = async () => {
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setError(validationErrors.join(". "));
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      // Convert empty strings to numbers for calculation
      const age = patientData.age === '' ? 0 : Number(patientData.age);
      const weight = patientData.weight === '' ? 0 : Number(patientData.weight);
      const height = patientData.height === '' ? 0 : Number(patientData.height);
      const yearsOnART = patientData.yearsOnART === '' ? 0 : Number(patientData.yearsOnART);

      const bmi = calculateBMI(weight, height);
      const bmiCategory = getBMICategory(bmi);
      const ageGroup = getAgeGroup(age);

      // Prepare data for the API
      const apiData = {
        patientId: `ART-${Date.now()}`,
        name: patientData.name,
        AGE: age,
        SEX_ENCODED: patientData.sex,
        'BODY MASS INDEX': bmi,
        'YEARS ON ART': yearsOnART,
        'BP HISTORY': patientData.bpHistory ? 1 : 0,
        'EXERCISES': patientData.exercise ? 1 : 0,
        'BMI_CAT_ENCODED': bmiCategory,
        'AGE_GROUP_ENCODED': ageGroup,
        'TENOFOVIR': getMedicationEncoded(patientData.medications, 'Tenofovir'),
        'LAMIVUDINE': getMedicationEncoded(patientData.medications, 'Lamivudine'),
        'DOLUTEGRAVIR': getMedicationEncoded(patientData.medications, 'Dolutegravir'),
        'DARUNAVIR': getMedicationEncoded(patientData.medications, 'Darunavir'),
        'ZIDOVUDINE': getMedicationEncoded(patientData.medications, 'Zidovudine'),
        'ABACAVIR': getMedicationEncoded(patientData.medications, 'Abacavir')
      };

      console.log('Sending data to API:', apiData);

      // Send request to backend
      const response = await api.post('/api/predict', apiData);

      // Save the response
      setApiResponse(response.data);
      savePatient(response.data, patientData, bmi);
      setRetryCount(0);
      return response.data;
    } catch (err: any) {
      console.error('Error:', err);

      // Handle specific error cases
      if (err.response) {
        // The request was made and the server responded with a status code
        if (err.response.data && err.response.data.details) {
          setError(err.response.data.details);
        } else if (err.response.data && err.response.data.message) {
          setError(err.response.data.message);
        } else {
          setError(`Server error: ${err.response.status} - ${err.response.statusText}`);
        }
      } else if (err.request) {
        // The request was made but no response was received
        setError('No response from server. Please check if the backend is running.');
      } else {
        // Something happened in setting up the request
        setError(`Request error: ${err.message}`);
      }

      // Retry logic
      if (retryCount < 2) {
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          predictRisk();
        }, 1000 * (retryCount + 1)); // Exponential backoff: 1s, 2s
      } else {
        setRetryCount(0);
      }

      return null;
    } finally {
      setLoading(false);
    }
  };

  // const savePatient = (apiData: ApiResponse, formData: typeof patientData, bmi: number) => {
  //   const newPatient: Patient = {
  //     id: apiData.patientId,
  //     name: apiData.patientName,
  //     age: formData.age,
  //     sex: formData.sex,
  //     weight: formData.weight,
  //     height: formData.height,
  //     yearsOnART: formData.yearsOnART,
  //     bpHistory: formData.bpHistory,
  //     exercise: formData.exercise,
  //     medications: formData.medications,
  //     status: apiData.riskLevel,
  //     probability: apiData.probability,
  //     lastCheckup: new Date().toISOString().split('T')[0],
  //     recommendations: apiData.recommendations
  //   };

  //   const updatedPatients = [...patients, newPatient];
  //   setPatients(updatedPatients);
  //   localStorage.setItem('art-patients', JSON.stringify(updatedPatients));
  // };

  const savePatient = (apiData: ApiResponse, formData: typeof patientData, bmi: number) => {
    const newPatient: Patient = {
      id: apiData.patientId,
      name: apiData.patientName,
      age: formData.age === '' ? 0 : Number(formData.age),
      sex: formData.sex,
      weight: formData.weight === '' ? 0 : Number(formData.weight),
      height: formData.height === '' ? 0 : Number(formData.height),
      yearsOnART: formData.yearsOnART === '' ? 0 : Number(formData.yearsOnART),
      bpHistory: formData.bpHistory,
      exercise: formData.exercise,
      medications: formData.medications,
      status: apiData.riskLevel,
      probability: apiData.probability,
      lastCheckup: new Date().toISOString().split('T')[0],
      recommendations: apiData.recommendations
    };

    const updatedPatients = [newPatient, ...patients];
    setPatients(updatedPatients);
    localStorage.setItem('art-patients', JSON.stringify(updatedPatients));
  };

  // const deletePatient = (id: string) => {
  //   const updatedPatients = patients.filter(patient => patient.id !== id);
  //   setPatients(updatedPatients);
  //   localStorage.setItem('art-patients', JSON.stringify(updatedPatients));
  // };

  const deletePatient = (id: string) => {
    const updatedPatients = patients.filter(patient => patient.id !== id);
    setPatients(updatedPatients);
    localStorage.setItem('art-patients', JSON.stringify(updatedPatients));
    setShowDeleteConfirm(false);
    setPatientToDelete(null);
  };

  // Helper to format sex display
  const formatSex = (sex: number): string => {
    return sex === 1 ? 'Male' : 'Female';
  };

  // Patient Details Modal Component
  function PatientDetailsModal({ patient, onClose }: { patient: Patient | null; onClose: () => void }) {
    if (!patient) return null;

    const bmi = (patient.weight / ((patient.height / 100) ** 2)).toFixed(1);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 overflow-y-auto">
        <div className="bg-gradient-to-b from-purple-900 to-purple-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-purple-900 p-4 border-b border-purple-700 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">Patient Details</h2>
            <button
              onClick={onClose}
              className="text-purple-300 hover:text-white text-2xl cursor-pointer"
            >
              ✕
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Patient Information */}
            <div className="bg-purple-800 bg-opacity-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-purple-300 mb-3">Patient Information</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="font-medium">Name:</span> {patient.name}</div>
                <div><span className="font-medium">Age:</span> {patient.age}</div>
                <div><span className="font-medium">Sex:</span> {patient.sex === 1 ? 'Male' : 'Female'}</div>
                <div><span className="font-medium">Weight/Height:</span> {patient.weight}kg / {patient.height}cm</div>
                <div><span className="font-medium">BMI:</span> {bmi}</div>
              </div>
            </div>

            {/* ART History */}
            <div className="bg-purple-800 bg-opacity-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-purple-300 mb-3">ART History</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="font-medium">Years on ART:</span> {patient.yearsOnART}</div>
                <div><span className="font-medium">BP History:</span> {patient.bpHistory ? 'Yes' : 'No'}</div>
                <div><span className="font-medium">Exercise:</span> {patient.exercise ? 'Yes' : 'No'}</div>
                <div className="col-span-2"><span className="font-medium">Medications:</span> {patient.medications.join(', ') || 'None'}</div>
              </div>
            </div>

            {/* Risk Assessment */}
            <div className="bg-purple-800 bg-opacity-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-purple-300 mb-3">Risk Assessment</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${patient.status === 'High' ? 'bg-red-900 text-red-100' :
                    patient.status === 'Moderate' ? 'bg-yellow-900 text-yellow-100' :
                      'bg-green-900 text-green-100'
                    }`}>
                    {patient.status} Risk
                  </span>
                </div>
                <div><span className="font-medium">Probability:</span> {(patient.probability * 100).toFixed(1)}%</div>
                <div><span className="font-medium">Last Checkup:</span> {patient.lastCheckup}</div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-purple-800 bg-opacity-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-purple-300 mb-3">Clinical Recommendations</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                {patient.recommendations.map((rec, i) => (
                  <li key={i} className="text-purple-100">{rec}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="sticky bottom-0 bg-purple-900 p-4 border-t border-purple-700 flex justify-center">
            <button
              onClick={onClose}
              className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-lg font-medium cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-950 to-purple-800 text-white">
      <header className="fixed top-0 left-0 right-0 z-50 bg-purple-900 p-4 shadow-md">
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-2xl font-bold text-center sm:text-left">ART PATIENT HYPERTENSION RISK ASSESSMENT</h1>
          <nav className="flex flex-wrap justify-center gap-2 sm:gap-4">
            <button
              onClick={() => setActiveTab('home')}
              className={`px-3 py-1 sm:px-4 sm:py-2 rounded-lg cursor-pointer ${activeTab === 'home' ? 'bg-purple-700' : 'hover:bg-purple-800'}`}
            >
              Home
            </button>
            <button
              onClick={() => setActiveTab('test')}
              className={`px-3 py-1 sm:px-4 sm:py-2 rounded-lg cursor-pointer ${activeTab === 'test' ? 'bg-purple-700' : 'hover:bg-purple-800'}`}
            >
              Risk Assessment
            </button>
            <button
              onClick={() => router.push('/')}
              className="bg-purple-600 hover:bg-purple-700 px-3 py-1 sm:px-4 sm:py-2 rounded-lg cursor-pointer"
            >
              Logout
            </button>
          </nav>
        </div>
      </header>

      <main className="container mx-auto p-4 pt-24">
        {activeTab === 'home' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">ART Patient Dashboard</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              <div className="bg-purple-800 bg-opacity-50 p-4 sm:p-6 rounded-lg border border-purple-600">
                <h3 className="text-lg sm:text-xl font-semibold">Total Patients</h3>
                <p className="text-3xl sm:text-4xl font-bold text-purple-300">{patients.length}</p>
              </div>
              <div className="bg-purple-800 bg-opacity-50 p-4 sm:p-6 rounded-lg border border-purple-600">
                <h3 className="text-lg sm:text-xl font-semibold">High Risk</h3>
                <p className="text-3xl sm:text-4xl font-bold text-red-300">
                  {patients.filter(p => p.status === 'High').length}
                </p>
              </div>
              <div className="bg-purple-800 bg-opacity-50 p-4 sm:p-6 rounded-lg border border-purple-600">
                <h3 className="text-lg sm:text-xl font-semibold">Moderate Risk</h3>
                <p className="text-3xl sm:text-4xl font-bold text-yellow-300">
                  {patients.filter(p => p.status === 'Moderate').length}
                </p>
              </div>
              <div className="bg-purple-800 bg-opacity-50 p-4 sm:p-6 rounded-lg border border-purple-600">
                <h3 className="text-lg sm:text-xl font-semibold">Low Risk</h3>
                <p className="text-3xl sm:text-4xl font-bold text-green-300">
                  {patients.filter(p => p.status === 'Low').length}
                </p>
              </div>
            </div>

            <div className="bg-purple-800 bg-opacity-50 p-4 sm:p-6 rounded-lg border border-purple-600">
              <h3 className="text-xl font-semibold mb-4">Patient Records</h3>
              {/* Search Input */}
              <div className="mb-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="🔍 Search patients by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 bg-purple-900 bg-opacity-50 border border-purple-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 text-white placeholder-purple-300"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-300 hover:text-white cursor-pointer"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
              {/* Status Filter Buttons */}
              <div className="mb-4 flex gap-2 flex-wrap">
                <button
                  onClick={() => setStatusFilter('All')}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition duration-200 cursor-pointer ${statusFilter === 'All'
                    ? 'bg-purple-600 text-white'
                    : 'bg-purple-900 bg-opacity-50 text-purple-300 hover:bg-purple-700'
                    }`}
                >
                  All ({patients.length})
                </button>
                <button
                  onClick={() => setStatusFilter('High')}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition duration-200 cursor-pointer ${statusFilter === 'High'
                    ? 'bg-red-600 text-white'
                    : 'bg-purple-900 bg-opacity-50 text-red-300 hover:bg-purple-700'
                    }`}
                >
                  High Risk ({patients.filter(p => p.status === 'High').length})
                </button>
                <button
                  onClick={() => setStatusFilter('Moderate')}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition duration-200 cursor-pointer ${statusFilter === 'Moderate'
                    ? 'bg-yellow-600 text-white'
                    : 'bg-purple-900 bg-opacity-50 text-yellow-300 hover:bg-purple-700'
                    }`}
                >
                  Moderate Risk ({patients.filter(p => p.status === 'Moderate').length})
                </button>
                <button
                  onClick={() => setStatusFilter('Low')}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition duration-200 cursor-pointer ${statusFilter === 'Low'
                    ? 'bg-green-600 text-white'
                    : 'bg-purple-900 bg-opacity-50 text-green-300 hover:bg-purple-700'
                    }`}
                >
                  Low Risk ({patients.filter(p => p.status === 'Low').length})
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-purple-600">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 sm:px-6 sm:py-3 text-left text-sm font-medium text-purple-300 uppercase">Name</th>
                      <th className="px-4 py-2 sm:px-6 sm:py-3 text-left text-sm font-medium text-purple-300 uppercase">Age/Sex</th>
                      <th className="px-4 py-2 sm:px-6 sm:py-3 text-left text-sm font-medium text-purple-300 uppercase">BMI</th>
                      <th className="px-4 py-2 sm:px-6 sm:py-3 text-left text-sm font-medium text-purple-300 uppercase">Years on ART</th>
                      <th className="px-4 py-2 sm:px-6 sm:py-3 text-left text-sm font-medium text-purple-300 uppercase">Status</th>
                      <th className="px-4 py-2 sm:px-6 sm:py-3 text-left text-sm font-medium text-purple-300 uppercase">Last Checkup</th>
                      <th className="px-4 py-2 sm:px-6 sm:py-3 text-left text-sm font-medium text-purple-300 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-purple-700">
                    {/* {patients.slice(0, 5).map(patient => {   */}

                    {/* {(showAllPatients ? patients : patients.slice(0, 5)).map(patient => { */}
                    {(showAllPatients ? filteredPatients : filteredPatients.slice(0, 5)).map(patient => {
                      const bmi = calculateBMI(patient.weight, patient.height);
                      return (
                        <tr key={patient.id}>
                          <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap">{patient.name}</td>

                          <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap">{patient.age}/{formatSex(patient.sex)}</td>
                          <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap">{bmi}</td>
                          <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap">{patient.yearsOnART}</td>
                          <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${patient.status === 'High' ? 'bg-red-900 text-red-100' :
                              patient.status === 'Moderate' ? 'bg-yellow-900 text-yellow-100' :
                                'bg-green-900 text-green-100'
                              }`}>
                              {patient.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap">{patient.lastCheckup}</td>
                          <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap">
                            <div className="flex gap-2">
                              <button
                                onClick={() => setSelectedPatient(patient)}
                                className="text-blue-400 hover:text-blue-300 cursor-pointer"
                                title="View Details"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => {
                                  setPatientToDelete(patient.id);
                                  setShowDeleteConfirm(true);
                                }}
                                className="text-red-400 hover:text-red-300 cursor-pointer"
                                title="Delete Patient"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                              </button>
                            </div>
                          </td>
                          {/* <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap">
                            <button
                              onClick={() => deletePatient(patient.id)}
                              className="text-red-400 hover:text-red-300"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </td> */}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {/* Add See More/Collapse button here */}
              {/* {patients.length > 5 && (
                <div className="flex justify-center mt-6">
                  <button
                    onClick={() => setShowAllPatients(!showAllPatients)}
                    className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-lg font-medium transition duration-300 flex items-center gap-2 cursor-pointer"
                  >
                    {showAllPatients ? (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                        </svg>
                        Show Less
                      </>
                    ) : (
                      <>
                        See More ({patients.length - 5} more)
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </>
                    )}
                  </button>
                </div>
              )} */}
              {filteredPatients.length > 5 && (
                <div className="flex justify-center mt-6">
                  <button
                    onClick={() => setShowAllPatients(!showAllPatients)}
                    className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-lg font-medium transition duration-300 flex items-center gap-2 cursor-pointer"
                  >
                    {showAllPatients ? (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                        </svg>
                        Show Less
                      </>
                    ) : (
                      <>
                        See More ({filteredPatients.length - 5} more)
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'test' && (
          <div className="space-y-6">
            {/* <h2 className="text-2xl font-bold">ART Patient Hypertension Risk Assessment</h2> */}
            <h2 className="text-2xl font-bold">Enter Patient Details</h2>
            {error && (
              <div className="bg-red-900 bg-opacity-50 p-4 rounded-lg">
                <p className="text-red-200">{error}</p>
                {retryCount > 0 && (
                  <p className="text-red-200 mt-2">Attempt {retryCount + 1} of 3...</p>
                )}
              </div>
            )}

            {!apiResponse ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  predictRisk();
                }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {/* Patient Information */}
                  <div className="bg-purple-800 bg-opacity-50 p-4 rounded-lg border border-purple-600">
                    <label className="block text-purple-200 mb-2">Patient Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={patientData.name}
                      onChange={handleInputChange}
                      onKeyDown={(e) => {
                        // Prevent number keys from being entered
                        const numberKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
                        if (numberKeys.includes(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      className="w-full px-3 py-2 sm:px-4 sm:py-2 bg-purple-900 bg-opacity-30 border border-purple-500 rounded-lg"
                      required
                    />
                  </div>

                  <div className="bg-purple-800 bg-opacity-50 p-4 rounded-lg border border-purple-600">
                    <label className="block text-purple-200 mb-2">Age (0-120 years)</label>
                    {/* <input
                      type="number"
                      name="age"
                      // value={patientData.age || ''}
                      value={patientData.age ?? ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 sm:px-4 sm:py-2 bg-purple-900 bg-opacity-30 border border-purple-500 rounded-lg"
                      min="0"
                      max="120"
                      required
                    /> */}
                    <input
                      type="number"
                      name="age"
                      value={patientData.age ?? ''}
                      onChange={handleInputChange}
                      onKeyDown={(e) => preventInvalidNumber(e, 0, 125)}
                      className="w-full px-3 py-2 sm:px-4 sm:py-2 bg-purple-900 bg-opacity-30 border border-purple-500 rounded-lg"
                      min="0"
                      max="125"
                      required
                    />
                  </div>

                  <div className="bg-purple-800 bg-opacity-50 p-4 rounded-lg border border-purple-600">
                    <label className="block text-purple-200 mb-2">Sex</label>
                    <select
                      name="sex"
                      value={patientData.sex}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 sm:px-4 sm:py-2 bg-purple-900 bg-opacity-30 border border-purple-500 rounded-lg"
                      required
                    >
                      <option value={1}>Male</option>
                      <option value={0}>Female</option>
                    </select>
                  </div>

                  <div className="bg-purple-800 bg-opacity-50 p-4 rounded-lg border border-purple-600">
                    <label className="block text-purple-200 mb-2">Weight (kg, 1.5-250)</label>
                    {/* <input
                      type="number"
                      name="weight"
                      value={patientData.weight || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 sm:px-4 sm:py-2 bg-purple-900 bg-opacity-30 border border-purple-500 rounded-lg"
                      min="1.5"
                      max="250"
                      step="0.1"
                      required
                    /> */}
                    <input
                      type="number"
                      name="weight"
                      value={patientData.weight || ''}
                      onChange={handleInputChange}
                      onKeyDown={(e) => preventInvalidNumber(e, 1.5, 270)}
                      className="w-full px-3 py-2 sm:px-4 sm:py-2 bg-purple-900 bg-opacity-30 border border-purple-500 rounded-lg"
                      min="1.5"
                      max="270"
                      step="0.1"
                      required
                    />
                  </div>

                  <div className="bg-purple-800 bg-opacity-50 p-4 rounded-lg border border-purple-600">
                    <label className="block text-purple-200 mb-2">Height (cm, 30-250)</label>
                    {/* <input
                      type="number"
                      name="height"
                      value={patientData.height || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 sm:px-4 sm:py-2 bg-purple-900 bg-opacity-30 border border-purple-500 rounded-lg"
                      min="30"
                      max="250"
                      step="0.1"
                      required
                    /> */}
                    {/* <input
                      type="number"
                      name="height"
                      value={patientData.height || ''}
                      onChange={handleInputChange}
                      onKeyDown={(e) => preventInvalidNumber(e, 30, 270)}
                      className="w-full px-3 py-2 sm:px-4 sm:py-2 bg-purple-900 bg-opacity-30 border border-purple-500 rounded-lg"
                      min="30"
                      max="270"
                      step="0.1"
                      required
                    /> */}
                    <input
                      type="number"
                      name="height"
                      value={patientData.height || ''}
                      onChange={handleInputChange}
                      onKeyDown={(e) => preventInvalidNumber(e, 30, 270)}
                      className="w-full px-3 py-2 sm:px-4 sm:py-2 bg-purple-900 bg-opacity-30 border border-purple-500 rounded-lg"
                      min="30"
                      max="270"  // Make sure this is 270, not 3
                      step="0.1"
                      required
                    />
                  </div>

                  <div className="bg-purple-800 bg-opacity-50 p-4 rounded-lg border border-purple-600">
                    <label className="block text-purple-200 mb-2">Years on ART (0-120)</label>
                    {/* <input
                      type="number"
                      name="yearsOnART"
                      value={patientData.yearsOnART ?? ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 sm:px-4 sm:py-2 bg-purple-900 bg-opacity-30 border border-purple-500 rounded-lg"
                      min="0"
                      max="120"
                      step="0"
                      required
                    /> */}
                    <input
                      type="number"
                      name="yearsOnART"
                      value={patientData.yearsOnART ?? ''}
                      onChange={handleInputChange}
                      onKeyDown={(e) => preventInvalidNumber(e, 0, 120)}
                      className="w-full px-3 py-2 sm:px-4 sm:py-2 bg-purple-900 bg-opacity-30 border border-purple-500 rounded-lg"
                      min="0"
                      max="120"
                      step="0"
                      required
                    />
                  </div>

                  <div className="bg-purple-800 bg-opacity-50 p-4 rounded-lg border border-purple-600">
                    <label className="block text-purple-200 mb-2">BP History</label>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="bpHistory"
                          checked={patientData.bpHistory === true}
                          onChange={() => setPatientData(prev => ({ ...prev, bpHistory: true }))}
                          className="form-radio"
                        />
                        <span>Yes</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="bpHistory"
                          checked={patientData.bpHistory === false}
                          onChange={() => setPatientData(prev => ({ ...prev, bpHistory: false }))}
                          className="form-radio"
                        />
                        <span>No</span>
                      </label>
                    </div>
                  </div>

                  <div className="bg-purple-800 bg-opacity-50 p-4 rounded-lg border border-purple-600">
                    <label className="block text-purple-200 mb-2">Regular Exercise</label>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="exercise"
                          checked={patientData.exercise === true}
                          onChange={() => setPatientData(prev => ({ ...prev, exercise: true }))}
                          className="form-radio"
                        />
                        <span>Yes</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="exercise"
                          checked={patientData.exercise === false}
                          onChange={() => setPatientData(prev => ({ ...prev, exercise: false }))}
                          className="form-radio"
                        />
                        <span>No</span>
                      </label>
                    </div>
                  </div>

                  <div className="bg-purple-800 bg-opacity-50 p-4 rounded-lg border border-purple-600 md:col-span-2">
                    <label className="block text-purple-200 mb-2">ART Medications (Select all that apply)</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {ART_MEDICATIONS.map(med => (
                        <label key={med} className="flex items-center gap-2 p-2 bg-purple-900 bg-opacity-30 rounded-lg">
                          <input
                            type="checkbox"
                            checked={patientData.medications.includes(med)}
                            onChange={() => handleMedicationChange(med)}
                            className="form-checkbox"
                          />
                          <span>{med}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-center">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg font-medium text-lg flex items-center gap-2 cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {retryCount > 0 ? `Retrying... (${retryCount})` : 'Processing...'}
                      </>
                    ) : (
                      'Assess Hypertension Risk'
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="bg-purple-800 bg-opacity-50 p-6 rounded-lg border border-purple-600">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="bg-purple-900 bg-opacity-30 p-4 rounded-lg">
                        <h4 className="text-purple-300 font-medium">Patient Information</h4>
                        <div className="mt-2 space-y-2">
                          <p><span className="font-medium">Name:</span> {patientData.name}</p>
                          <p><span className="font-medium">Age:</span> {patientData.age}</p>
                          <p><span className="font-medium">Sex:</span> {formatSex(patientData.sex)}</p>
                          <p><span className="font-medium">Weight/Height:</span> {patientData.weight}kg / {patientData.height}cm</p>
                          <p><span className="font-medium">BMI:</span> {calculateBMI(patientData.weight, patientData.height)}</p>
                        </div>
                      </div>

                      <div className="bg-purple-900 bg-opacity-30 p-4 rounded-lg">
                        <h4 className="text-purple-300 font-medium">ART History</h4>
                        <div className="mt-2 space-y-2">
                          <p><span className="font-medium">Years on ART:</span> {patientData.yearsOnART}</p>
                          <p><span className="font-medium">BP History:</span> {patientData.bpHistory ? 'Yes' : 'No'}</p>
                          <p><span className="font-medium">Exercise:</span> {patientData.exercise ? 'Yes' : 'No'}</p>
                          <p><span className="font-medium">Medications:</span> {patientData.medications.join(', ') || 'None selected'}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-purple-900 bg-opacity-30 p-4 rounded-lg">
                        <h4 className="text-purple-300 font-medium">Risk Assessment</h4>
                        <div className="mt-2 space-y-2">
                          <p className="flex items-center gap-2">
                            <span className="font-medium">Status:</span>
                            <span className={`px-2 py-1 rounded-full text-sm font-medium ${apiResponse.riskLevel === 'High' ? 'bg-red-900 text-red-100' :
                              apiResponse.riskLevel === 'Moderate' ? 'bg-yellow-900 text-yellow-100' :
                                'bg-green-900 text-green-100'
                              }`}>
                              {apiResponse.riskLevel} Risk
                            </span>
                          </p>
                          <p><span className="font-medium">Probability:</span> {apiResponse.riskScore || (apiResponse.probability * 100).toFixed(1) + '%'}</p>
                          <p><span className="font-medium">Prediction:</span> {apiResponse.prediction}</p>
                          <p><span className="font-medium">Model Used:</span> {apiResponse.modelUsed || 'Random Forest'}</p>
                          <p><span className="font-medium">Date:</span> {new Date().toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-800 bg-opacity-50 p-6 rounded-lg border border-purple-600">
                  <h3 className="text-xl font-semibold mb-4">Clinical Recommendations</h3>
                  <ul className="list-disc list-inside space-y-2 pl-4">
                    {apiResponse.recommendations.map((rec, i) => (
                      <li key={i}>{rec}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-purple-800 bg-opacity-50 p-6 rounded-lg border border-purple-600">
                  <div className="flex flex-wrap gap-4 justify-center">
                    <button
                      onClick={() => setApiResponse(null)}
                      className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg font-medium flex items-center gap-2 cursor-pointer"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-10.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L9.414 11H13a1 1 0 100-2H9.414l1.293-1.293z" clipRule="evenodd" />
                      </svg>
                      New Assessment
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
      {/* Patient Details Modal */}
      {selectedPatient && (
        <PatientDetailsModal
          patient={selectedPatient}
          onClose={() => setSelectedPatient(null)}
        />
      )}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-purple-800 rounded-lg p-6 max-w-sm mx-4 border border-purple-600">
            <p className="text-white mb-6">Delete this patient?</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 bg-gray-600 rounded-md text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => deletePatient(patientToDelete!)}
                className="px-4 py-2 bg-red-600 rounded-md text-white cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}