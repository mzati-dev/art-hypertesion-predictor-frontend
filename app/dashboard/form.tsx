// 'use client'
// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
// import { Pie, Bar } from 'react-chartjs-2';
// import axios from 'axios';

// ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

// // Extend Axios types to include metadata
// declare module 'axios' {
//   interface InternalAxiosRequestConfig {
//     metadata?: {
//       startTime?: number;
//     };
//   }
// }

// type RiskStatus = 'High' | 'Low';

// const MALAWI_DISTRICTS = [
//   'Balaka', 'Blantyre', 'Chikwawa', 'Chiradzulu', 'Chitipa',
//   'Dedza', 'Dowa', 'Karonga', 'Kasungu', 'Likoma',
//   'Lilongwe', 'Machinga', 'Mangochi', 'Mchinji', 'Mulanje',
//   'Mwanza', 'Mzimba', 'Neno', 'Nkhata Bay', 'Nkhotakota',
//   'Nsanje', 'Ntcheu', 'Ntchisi', 'Phalombe', 'Rumphi',
//   'Salima', 'Thyolo', 'Zomba'
// ];

// type Patient = {
//   id: string;
//   name: string;
//   age: number;
//   location: string;
//   gestationAge: number;
//   gravidity: number;
//   parity: number;
//   antenatalVisit: number;
//   systolic: number;
//   diastolic: number;
//   pulseRate: number;
//   status: RiskStatus;
//   probability: number;
//   lastCheckup: string;
//   recommendations: string[];
// };

// type ApiResponse = {
//   patientId: string;
//   patientName: string;
//   riskLevel: RiskStatus;
//   probability: number;
//   recommendations: string[];
//   timestamp: string;
//   inputFeatures: any;
// };

// const api = axios.create({
//   baseURL: 'https://maternal-backend.onrender.com',
//   timeout: 30000, // Increased timeout to 30 seconds
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Add interceptors for better error handling
// api.interceptors.request.use(config => {
//   config.metadata = { startTime: new Date().getTime() };
//   return config;
// });

// api.interceptors.response.use(
//   response => {
//     const endTime = new Date().getTime();
//     const duration = endTime - (response.config.metadata?.startTime || endTime);
//     console.log(`Request to ${response.config.url} took ${duration}ms`);
//     return response;
//   },
//   error => {
//     if (error.code === 'ECONNABORTED') {
//       console.error('Request timed out:', error.config.url);
//     }
//     return Promise.reject(error);
//   }
// );

// export default function Dashboard() {
//   const router = useRouter();
//   const [activeTab, setActiveTab] = useState<'home' | 'test'>('home');
//   const [patientData, setPatientData] = useState({
//     name: '',
//     age: 25,
//     location: 'Lilongwe',
//     chronicCondition: 'No',
//     previousPregnancyComplication: 'No',
//     gestationAge: 38,
//     gravidity: 1,
//     parity: 0,
//     antenatalVisit: 4,
//     systolic: 120,
//     diastolic: 80,
//     pulseRate: 70,
//     specificComplication: 'No',
//     deliveryMode: 'Spontaneous Vertex Delivery',
//     staffConductedDelivery: 'Skilled'
//   });
//   const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [patients, setPatients] = useState<Patient[]>([]);
//   const [error, setError] = useState<string | null>(null);
//   const [retryCount, setRetryCount] = useState(0);

//   useEffect(() => {
//     const savedPatients = localStorage.getItem('maternal-patients');
//     if (savedPatients) {
//       try {
//         setPatients(JSON.parse(savedPatients));
//       } catch (err) {
//         console.error('Error parsing patient data:', err);
//       }
//     }
//   }, []);

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setPatientData(prev => ({
//       ...prev,
//       [name]: ['age', 'gestationAge', 'gravidity', 'parity', 'antenatalVisit',
//         'systolic', 'diastolic', 'pulseRate'].includes(name)
//         ? Number(value)
//         : value
//     }));
//   };

//   const validateForm = () => {
//     const errors = [];

//     if (!patientData.name) errors.push("Patient name is required");
//     if (patientData.age < 10 || patientData.age > 60) errors.push("Age must be between 10 and 60");
//     if (patientData.gestationAge < 0 || patientData.gestationAge > 45) errors.push("Gestation age must be between 0 and 45 weeks");
//     if (patientData.systolic < 50 || patientData.systolic > 300) errors.push("Systolic BP must be between 50 and 300 mmHg");
//     if (patientData.diastolic < 30 || patientData.diastolic > 200) errors.push("Diastolic BP must be between 30 and 200 mmHg");
//     if (patientData.pulseRate < 30 || patientData.pulseRate > 220) errors.push("Pulse rate must be between 30 and 220 bpm");

//     return errors;
//   };

//   // Add this above your predictRisk function
//   const RECOMMENDATIONS = {
//     High: [
//       "Immediate consultation with obstetric specialist required",
//       "Increased frequency of antenatal visits",
//       "Continuous fetal monitoring recommended",
//       "Consider hospitalization for close observation",
//       "Strict blood pressure monitoring",
//       "Bed rest may be advised",
//       "Emergency contact numbers provided"
//     ],
//     Low: [
//       "Continue with regular antenatal check-ups",
//       "Maintain balanced diet with adequate protein and iron",
//       "Moderate exercise recommended",
//       "Monitor blood pressure weekly",
//       "Attend all prenatal education classes",
//       "Maintain hydration and proper rest",
//       "Report any unusual symptoms immediately"
//     ]
//   };

//   const predictRisk = async () => {
//     const validationErrors = validateForm();
//     if (validationErrors.length > 0) {
//       setError(validationErrors.join(". "));
//       return null;
//     }

//     setLoading(true);
//     setError(null);

//     try {
//       // High-Risk Factors (will trigger High Risk if true)
//       const ageRisk = patientData.age <= 16 || patientData.age >= 35;
//       const gravidityRisk = patientData.gravidity >= 4;
//       const bpRisk = patientData.systolic > 140 || patientData.diastolic > 90;
//       const fewAntenatalVisits = patientData.antenatalVisit < 4;
//       const cesareanRisk = patientData.deliveryMode === "Caesarean Section";
//       const complicationRisk = patientData.specificComplication === "Yes";

//       // Low-Risk Factors (will NOT trigger High Risk, but may affect probability)
//       const chronicConditionRisk = patientData.chronicCondition === "Yes";
//       const previousComplicationRisk = patientData.previousPregnancyComplication === "Yes";
//       const unskilledDeliveryRisk = patientData.staffConductedDelivery === "Unskilled";

//       // Final High Risk Check (only includes HIGH-risk factors)
//       const isHighRisk = ageRisk || gravidityRisk || bpRisk || fewAntenatalVisits || cesareanRisk || complicationRisk;

//       const riskLevel = isHighRisk ? 'High' : 'Low';

//       // Probability calculation (Low-Risk factors have minimal impact)
//       const probability =
//         cesareanRisk ? 0.95 :
//           complicationRisk ? 0.9 :
//             bpRisk ? 0.85 :
//               ageRisk ? 0.8 :
//                 gravidityRisk ? 0.75 :
//                   fewAntenatalVisits ? 0.7 :
//                     // Low-risk factors slightly increase probability, but not enough to make it High Risk
//                     chronicConditionRisk ? 0.4 :
//                       previousComplicationRisk ? 0.35 :
//                         unskilledDeliveryRisk ? 0.3 : 0.2;

//       const mockResponse: ApiResponse = {
//         patientId: `patient-${Date.now()}`,
//         patientName: patientData.name,
//         riskLevel,
//         probability,
//         recommendations: RECOMMENDATIONS[riskLevel],
//         timestamp: new Date().toISOString(),
//         inputFeatures: patientData
//       };

//       await new Promise(resolve => setTimeout(resolve, 1500));

//       setApiResponse(mockResponse);
//       savePatient(mockResponse);
//       setRetryCount(0);
//       return mockResponse;
//     } catch (err: any) {
//       console.error('Error:', err);
//       setError('An unexpected error occurred');
//       return null;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const savePatient = (apiData: ApiResponse) => {
//     const newPatient: Patient = {
//       id: apiData.patientId,
//       name: patientData.name,
//       age: patientData.age,
//       location: patientData.location,
//       gestationAge: patientData.gestationAge,
//       gravidity: patientData.gravidity,
//       parity: patientData.parity,
//       antenatalVisit: patientData.antenatalVisit,
//       systolic: patientData.systolic,
//       diastolic: patientData.diastolic,
//       pulseRate: patientData.pulseRate,
//       status: apiData.riskLevel,
//       probability: apiData.probability,
//       lastCheckup: new Date().toISOString().split('T')[0],
//       recommendations: apiData.recommendations
//     };

//     const updatedPatients = [...patients, newPatient];
//     setPatients(updatedPatients);
//     localStorage.setItem('maternal-patients', JSON.stringify(updatedPatients));
//   };

//   const deletePatient = (id: string) => {
//     const updatedPatients = patients.filter(patient => patient.id !== id);
//     setPatients(updatedPatients);
//     localStorage.setItem('maternal-patients', JSON.stringify(updatedPatients));
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-blue-950 to-blue-800 text-white">
//       <header className="bg-blue-900 p-4 shadow-md">
//         <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
//           <h1 className="text-2xl font-bold text-center sm:text-left">MATERNAL HEALTH RISK ASSESSMENT</h1>
//           <nav className="flex flex-wrap justify-center gap-2 sm:gap-4">
//             <button
//               onClick={() => setActiveTab('home')}
//               className={`px-3 py-1 sm:px-4 sm:py-2 rounded-lg ${activeTab === 'home' ? 'bg-blue-700' : 'hover:bg-blue-800'}`}
//             >
//               Home
//             </button>
//             <button
//               onClick={() => setActiveTab('test')}
//               className={`px-3 py-1 sm:px-4 sm:py-2 rounded-lg ${activeTab === 'test' ? 'bg-blue-700' : 'hover:bg-blue-800'}`}
//             >
//               Risk Assessment
//             </button>
//             <button
//               onClick={() => router.push('/')}
//               className="bg-blue-600 hover:bg-blue-700 px-3 py-1 sm:px-4 sm:py-2 rounded-lg"
//             >
//               Logout
//             </button>
//           </nav>
//         </div>
//       </header>

//       <main className="container mx-auto p-4">
//         {activeTab === 'home' && (
//           <div className="space-y-6">
//             <h2 className="text-2xl font-bold">Patient Dashboard</h2>

//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
//               <div className="bg-blue-800 bg-opacity-50 p-4 sm:p-6 rounded-lg border border-blue-600">
//                 <h3 className="text-lg sm:text-xl font-semibold">Total Patients</h3>
//                 <p className="text-3xl sm:text-4xl font-bold text-blue-300">{patients.length}</p>
//               </div>
//               <div className="bg-blue-800 bg-opacity-50 p-4 sm:p-6 rounded-lg border border-blue-600">
//                 <h3 className="text-lg sm:text-xl font-semibold">High Risk</h3>
//                 <p className="text-3xl sm:text-4xl font-bold text-yellow-300">
//                   {patients.filter(p => p.status === 'High').length}
//                 </p>
//               </div>
//               <div className="bg-blue-800 bg-opacity-50 p-4 sm:p-6 rounded-lg border border-blue-600">
//                 <h3 className="text-lg sm:text-xl font-semibold">Low Risk</h3>
//                 <p className="text-3xl sm:text-4xl font-bold text-blue-300">
//                   {patients.filter(p => p.status === 'Low').length}
//                 </p>
//               </div>
//             </div>

//             <div className="bg-blue-800 bg-opacity-50 p-4 sm:p-6 rounded-lg border border-blue-600">
//               <h3 className="text-xl font-semibold mb-4">Recent Patients</h3>
//               <div className="overflow-x-auto">
//                 <table className="min-w-full divide-y divide-blue-600">
//                   <thead>
//                     <tr>
//                       <th className="px-4 py-2 sm:px-6 sm:py-3 text-left text-sm font-medium text-blue-300 uppercase">Name</th>
//                       <th className="px-4 py-2 sm:px-6 sm:py-3 text-left text-sm font-medium text-blue-300 uppercase">Age</th>
//                       <th className="px-4 py-2 sm:px-6 sm:py-3 text-left text-sm font-medium text-blue-300 uppercase">Location</th>
//                       <th className="px-4 py-2 sm:px-6 sm:py-3 text-left text-sm font-medium text-blue-300 uppercase">Status</th>
//                       <th className="px-4 py-2 sm:px-6 sm:py-3 text-left text-sm font-medium text-blue-300 uppercase">Last Checkup</th>
//                       <th className="px-4 py-2 sm:px-6 sm:py-3 text-left text-sm font-medium text-blue-300 uppercase">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-blue-700">
//                     {patients.slice(0, 5).map(patient => (
//                       <tr key={patient.id}>
//                         <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap">{patient.name}</td>
//                         <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap">{patient.age}</td>
//                         <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap">{patient.location}</td>
//                         <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap">
//                           <span className={`px-2 py-1 rounded-full text-xs font-medium ${patient.status === 'High' ? 'bg-yellow-900 text-yellow-100' : 'bg-blue-900 text-blue-100'}`}>
//                             {patient.status}
//                           </span>
//                         </td>
//                         <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap">{patient.lastCheckup}</td>
//                         <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap">
//                           <button
//                             onClick={() => deletePatient(patient.id)}
//                             className="text-red-400 hover:text-red-300"
//                           >
//                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//                               <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
//                             </svg>
//                           </button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </div>
//         )}

//         {activeTab === 'test' && (
//           <div className="space-y-6">
//             <h2 className="text-2xl font-bold">Maternal Risk Assessment</h2>

//             {error && (
//               <div className="bg-red-900 bg-opacity-50 p-4 rounded-lg">
//                 <p className="text-red-200">{error}</p>
//                 {retryCount > 0 && (
//                   <p className="text-red-200 mt-2">Attempt {retryCount + 1} of 3...</p>
//                 )}
//               </div>
//             )}

//             {!apiResponse ? (
//               <form
//                 onSubmit={(e) => {
//                   e.preventDefault();
//                   predictRisk();
//                 }}
//                 className="space-y-6"
//               >
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
//                   <div className="bg-blue-800 bg-opacity-50 p-4 rounded-lg border border-blue-600">
//                     <label className="block text-blue-200 mb-2">Patient Name</label>
//                     <input
//                       type="text"
//                       name="name"
//                       value={patientData.name}
//                       onChange={handleInputChange}
//                       className="w-full px-3 py-2 sm:px-4 sm:py-2 bg-blue-900 bg-opacity-30 border border-blue-500 rounded-lg"
//                       required
//                     />
//                   </div>
//                   <div className="bg-blue-800 bg-opacity-50 p-4 rounded-lg border border-blue-600">
//                     <label className="block text-blue-200 mb-2">Age (10-60)</label>
//                     <input
//                       type="number"
//                       name="age"
//                       value={patientData.age || ''}
//                       onChange={handleInputChange}
//                       className="w-full px-3 py-2 sm:px-4 sm:py-2 bg-blue-900 bg-opacity-30 border border-blue-500 rounded-lg"
//                       min="10"
//                       max="60"
//                       required
//                     />
//                   </div>
//                   <div className="bg-blue-800 bg-opacity-50 p-4 rounded-lg border border-blue-600">
//                     <label className="block text-blue-200 mb-2">District</label>
//                     <select
//                       name="location"
//                       value={patientData.location}
//                       onChange={handleInputChange}
//                       className="w-full px-3 py-2 sm:px-4 sm:py-2 bg-blue-900 bg-opacity-30 border border-blue-500 rounded-lg"
//                       required
//                     >
//                       <option value="">Select District</option>
//                       {MALAWI_DISTRICTS.map(district => (
//                         <option key={district} value={district}>{district}</option>
//                       ))}
//                     </select>
//                   </div>
//                   <div className="bg-blue-800 bg-opacity-50 p-4 rounded-lg border border-blue-600">
//                     <label className="block text-blue-200 mb-2">Gestation Age (weeks, 0-45)</label>
//                     <input
//                       type="number"
//                       name="gestationAge"
//                       value={patientData.gestationAge || ''}
//                       onChange={handleInputChange}
//                       className="w-full px-3 py-2 sm:px-4 sm:py-2 bg-blue-900 bg-opacity-30 border border-blue-500 rounded-lg"
//                       min="0"
//                       max="45"
//                       required
//                     />
//                   </div>
//                   <div className="bg-blue-800 bg-opacity-50 p-4 rounded-lg border border-blue-600">
//                     <label className="block text-blue-200 mb-2">Gravidity</label>
//                     <input
//                       type="number"
//                       name="gravidity"
//                       value={patientData.gravidity || ''}
//                       onChange={handleInputChange}
//                       className="w-full px-3 py-2 sm:px-4 sm:py-2 bg-blue-900 bg-opacity-30 border border-blue-500 rounded-lg"
//                       min="0"
//                       max="20"
//                       required
//                     />
//                   </div>
//                   <div className="bg-blue-800 bg-opacity-50 p-4 rounded-lg border border-blue-600">
//                     <label className="block text-blue-200 mb-2">Parity</label>
//                     <input
//                       type="number"
//                       name="parity"
//                       value={patientData.parity || ''}
//                       onChange={handleInputChange}
//                       className="w-full px-3 py-2 sm:px-4 sm:py-2 bg-blue-900 bg-opacity-30 border border-blue-500 rounded-lg"
//                       min="0"
//                       max="20"
//                       required
//                     />
//                   </div>
//                   <div className="bg-blue-800 bg-opacity-50 p-4 rounded-lg border border-blue-600">
//                     <label className="block text-blue-200 mb-2">Antenatal Visits</label>
//                     <input
//                       type="number"
//                       name="antenatalVisit"
//                       value={patientData.antenatalVisit || ''}
//                       onChange={handleInputChange}
//                       className="w-full px-3 py-2 sm:px-4 sm:py-2 bg-blue-900 bg-opacity-30 border border-blue-500 rounded-lg"
//                       min="0"
//                       max="20"
//                       required
//                     />
//                   </div>
//                   <div className="bg-blue-800 bg-opacity-50 p-4 rounded-lg border border-blue-600">
//                     <label className="block text-blue-200 mb-2">Systolic BP (mmHg, 50-300)</label>
//                     <input
//                       type="number"
//                       name="systolic"
//                       value={patientData.systolic || ''}
//                       onChange={handleInputChange}
//                       className="w-full px-3 py-2 sm:px-4 sm:py-2 bg-blue-900 bg-opacity-30 border border-blue-500 rounded-lg"
//                       min="50"
//                       max="300"
//                       required
//                     />
//                   </div>
//                   <div className="bg-blue-800 bg-opacity-50 p-4 rounded-lg border border-blue-600">
//                     <label className="block text-blue-200 mb-2">Diastolic BP (mmHg, 30-200)</label>
//                     <input
//                       type="number"
//                       name="diastolic"
//                       value={patientData.diastolic || ''}
//                       onChange={handleInputChange}
//                       className="w-full px-3 py-2 sm:px-4 sm:py-2 bg-blue-900 bg-opacity-30 border border-blue-500 rounded-lg"
//                       min="30"
//                       max="200"
//                       required
//                     />
//                   </div>
//                   <div className="bg-blue-800 bg-opacity-50 p-4 rounded-lg border border-blue-600">
//                     <label className="block text-blue-200 mb-2">Pulse Rate (bpm, 30-220)</label>
//                     <input
//                       type="number"
//                       name="pulseRate"
//                       value={patientData.pulseRate || ''}
//                       onChange={handleInputChange}
//                       className="w-full px-3 py-2 sm:px-4 sm:py-2 bg-blue-900 bg-opacity-30 border border-blue-500 rounded-lg"
//                       min="30"
//                       max="220"
//                       required
//                     />
//                   </div>
//                   <div className="bg-blue-800 bg-opacity-50 p-4 rounded-lg border border-blue-600">
//                     <label className="block text-blue-200 mb-2">Chronic Condition</label>
//                     <select
//                       name="chronicCondition"
//                       value={patientData.chronicCondition}
//                       onChange={handleInputChange}
//                       className="w-full px-3 py-2 sm:px-4 sm:py-2 bg-blue-900 bg-opacity-30 border border-blue-500 rounded-lg"
//                       required
//                     >
//                       <option value="No">No</option>
//                       <option value="Yes">Yes</option>
//                     </select>
//                   </div>
//                   <div className="bg-blue-800 bg-opacity-50 p-4 rounded-lg border border-blue-600">
//                     <label className="block text-blue-200 mb-2">Previous Pregnancy Complication</label>
//                     <select
//                       name="previousPregnancyComplication"
//                       value={patientData.previousPregnancyComplication}
//                       onChange={handleInputChange}
//                       className="w-full px-3 py-2 sm:px-4 sm:py-2 bg-blue-900 bg-opacity-30 border border-blue-500 rounded-lg"
//                       required
//                     >
//                       <option value="No">No</option>
//                       <option value="Yes">Yes</option>
//                     </select>
//                   </div>
//                   <div className="bg-blue-800 bg-opacity-50 p-4 rounded-lg border border-blue-600">
//                     <label className="block text-blue-200 mb-2">Specific Complication</label>
//                     <select
//                       name="specificComplication"
//                       value={patientData.specificComplication}
//                       onChange={handleInputChange}
//                       className="w-full px-3 py-2 sm:px-4 sm:py-2 bg-blue-900 bg-opacity-30 border border-blue-500 rounded-lg"
//                       required
//                     >
//                       <option value="No">No</option>
//                       <option value="Yes">Yes</option>
//                     </select>
//                   </div>
//                   <div className="bg-blue-800 bg-opacity-50 p-4 rounded-lg border border-blue-600">
//                     <label className="block text-blue-200 mb-2">Delivery Mode</label>
//                     <select
//                       name="deliveryMode"
//                       value={patientData.deliveryMode}
//                       onChange={handleInputChange}
//                       className="w-full px-3 py-2 sm:px-4 sm:py-2 bg-blue-900 bg-opacity-30 border border-blue-500 rounded-lg"
//                       required
//                     >
//                       <option value="Spontaneous Vertex Delivery">Spontaneous Vertex Delivery</option>
//                       <option value="Caesarean Section">Caesarean Section</option>
//                     </select>
//                   </div>
//                   <div className="bg-blue-800 bg-opacity-50 p-4 rounded-lg border border-blue-600">
//                     <label className="block text-blue-200 mb-2">Staff Conducted Delivery</label>
//                     <select
//                       name="staffConductedDelivery"
//                       value={patientData.staffConductedDelivery}
//                       onChange={handleInputChange}
//                       className="w-full px-3 py-2 sm:px-4 sm:py-2 bg-blue-900 bg-opacity-30 border border-blue-500 rounded-lg"
//                       required
//                     >
//                       <option value="Skilled">Skilled</option>
//                       <option value="Unskilled">Unskilled</option>
//                     </select>
//                   </div>
//                 </div>

//                 <div className="flex justify-center">
//                   <button
//                     type="submit"
//                     disabled={loading}
//                     className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-medium text-lg flex items-center gap-2"
//                   >
//                     {loading ? (
//                       <>
//                         <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                           <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                           <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                         </svg>
//                         {retryCount > 0 ? `Retrying... (${retryCount})` : 'Processing...'}
//                       </>
//                     ) : (
//                       'Assess Maternal Risk'
//                     )}
//                   </button>
//                 </div>
//               </form>
//             ) : (
//               <div className="space-y-6">
//                 <div className="bg-blue-800 bg-opacity-50 p-6 rounded-lg border border-blue-600">
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <div className="space-y-4">
//                       <div className="bg-blue-900 bg-opacity-30 p-4 rounded-lg">
//                         <h4 className="text-blue-300 font-medium">Patient Information</h4>
//                         <div className="mt-2 space-y-2">
//                           <p><span className="font-medium">Name:</span> {patientData.name}</p>
//                           <p><span className="font-medium">Age:</span> {patientData.age}</p>
//                           <p><span className="font-medium">District:</span> {patientData.location}</p>
//                           <p><span className="font-medium">Gestation Age:</span> {patientData.gestationAge} weeks</p>
//                         </div>
//                       </div>

//                       <div className="bg-blue-900 bg-opacity-30 p-4 rounded-lg">
//                         <h4 className="text-blue-300 font-medium">Medical Information</h4>
//                         <div className="mt-2 space-y-2">
//                           <p><span className="font-medium">Gravidity:</span> {patientData.gravidity}</p>
//                           <p><span className="font-medium">Parity:</span> {patientData.parity}</p>
//                           <p><span className="font-medium">Antenatal Visits:</span> {patientData.antenatalVisit}</p>
//                         </div>
//                       </div>
//                     </div>

//                     <div className="space-y-4">
//                       <div className="bg-blue-900 bg-opacity-30 p-4 rounded-lg">
//                         <h4 className="text-blue-300 font-medium">Vital Signs</h4>
//                         <div className="mt-2 space-y-2">
//                           <p><span className="font-medium">Blood Pressure:</span> {patientData.systolic}/{patientData.diastolic} mmHg</p>
//                           <p><span className="font-medium">Pulse Rate:</span> {patientData.pulseRate} bpm</p>
//                         </div>
//                       </div>

//                       <div className="bg-blue-900 bg-opacity-30 p-4 rounded-lg">
//                         <h4 className="text-blue-300 font-medium">Risk Assessment</h4>
//                         <div className="mt-2 space-y-2">
//                           <p className="flex items-center gap-2">
//                             <span className="font-medium">Status:</span>
//                             <span className={`px-2 py-1 rounded-full text-sm font-medium ${apiResponse.riskLevel === 'High' ? 'bg-yellow-900 text-yellow-100' : 'bg-blue-900 text-blue-100'}`}>
//                               {apiResponse.riskLevel} Risk
//                             </span>
//                           </p>
//                           <p><span className="font-medium">Probability:</span> {(apiResponse.probability * 100).toFixed(1)}%</p>
//                           <p><span className="font-medium">Date:</span> {new Date().toLocaleDateString()}</p>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="bg-blue-800 bg-opacity-50 p-6 rounded-lg border border-blue-600">
//                   <h3 className="text-xl font-semibold mb-4">Recommendations</h3>
//                   <ul className="list-disc list-inside space-y-2 pl-4">
//                     {apiResponse.recommendations.map((rec, i) => (
//                       <li key={i}>{rec}</li>
//                     ))}
//                   </ul>
//                 </div>

//                 <div className="bg-blue-800 bg-opacity-50 p-6 rounded-lg border border-blue-600">
//                   <div className="flex flex-wrap gap-4 justify-center">
//                     <button
//                       onClick={() => setApiResponse(null)}
//                       className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-medium flex items-center gap-2"
//                     >
//                       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//                         <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-10.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L9.414 11H13a1 1 0 100-2H9.414l1.293-1.293z" clipRule="evenodd" />
//                       </svg>
//                       New Assessment
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         )}
//       </main>
//     </div>
//   );
// }


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

type RiskStatus = 'High' | 'Low';

const MALAWI_DISTRICTS = [
    'Balaka', 'Blantyre', 'Chikwawa', 'Chiradzulu', 'Chitipa',
    'Dedza', 'Dowa', 'Karonga', 'Kasungu', 'Likoma',
    'Lilongwe', 'Machinga', 'Mangochi', 'Mchinji', 'Mulanje',
    'Mwanza', 'Mzimba', 'Neno', 'Nkhata Bay', 'Nkhotakota',
    'Nsanje', 'Ntcheu', 'Ntchisi', 'Phalombe', 'Rumphi',
    'Salima', 'Thyolo', 'Zomba'
];

type Patient = {
    id: string;
    name: string;
    age: number;
    location: string;
    gestationAge: number;
    gravidity: number;
    parity: number;
    antenatalVisit: number;
    systolic: number;
    diastolic: number;
    pulseRate: number;
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
    recommendations: string[];
    timestamp: string;
    inputFeatures: any;
};

const api = axios.create({
    baseURL: 'https://maternal-backend.onrender.com',
    timeout: 30000, // Increased timeout to 30 seconds
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
    const [patientData, setPatientData] = useState({
        name: '',
        age: 25,
        location: 'Lilongwe',
        chronicCondition: 'No',
        previousPregnancyComplication: 'No',
        gestationAge: 38,
        gravidity: 1,
        parity: 0,
        antenatalVisit: 4,
        systolic: 120,
        diastolic: 80,
        pulseRate: 70,
        specificComplication: 'No',
        deliveryMode: 'Spontaneous Vertex Delivery',
        staffConductedDelivery: 'Skilled'
    });
    const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [patients, setPatients] = useState<Patient[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [retryCount, setRetryCount] = useState(0);

    useEffect(() => {
        const savedPatients = localStorage.getItem('maternal-patients');
        if (savedPatients) {
            try {
                setPatients(JSON.parse(savedPatients));
            } catch (err) {
                console.error('Error parsing patient data:', err);
            }
        }
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setPatientData(prev => ({
            ...prev,
            [name]: ['age', 'gestationAge', 'gravidity', 'parity', 'antenatalVisit',
                'systolic', 'diastolic', 'pulseRate'].includes(name)
                ? Number(value)
                : value
        }));
    };

    const validateForm = () => {
        const errors = [];

        if (!patientData.name) errors.push("Patient name is required");
        if (patientData.age < 10 || patientData.age > 60) errors.push("Age must be between 10 and 60");
        if (patientData.gestationAge < 0 || patientData.gestationAge > 45) errors.push("Gestation age must be between 0 and 45 weeks");
        if (patientData.systolic < 50 || patientData.systolic > 300) errors.push("Systolic BP must be between 50 and 300 mmHg");
        if (patientData.diastolic < 30 || patientData.diastolic > 200) errors.push("Diastolic BP must be between 30 and 200 mmHg");
        if (patientData.pulseRate < 30 || patientData.pulseRate > 220) errors.push("Pulse rate must be between 30 and 220 bpm");

        return errors;
    };

    const predictRisk = async () => {
        const validationErrors = validateForm();
        if (validationErrors.length > 0) {
            setError(validationErrors.join(". "));
            return null;
        }

        setLoading(true);
        setError(null);

        try {
            // Mock API call for demo
            const mockResponse: ApiResponse = {
                patientId: `patient-${Date.now()}`,
                patientName: patientData.name,
                riskLevel: (patientData.age <= 16 && patientData.gravidity >= 2) ||
                    patientData.systolic > 140 ||
                    patientData.diastolic > 90 ? 'High' : 'Low',
                probability: (patientData.age <= 16 && patientData.gravidity >= 2) ? 0.95 :
                    (patientData.systolic > 140 || patientData.diastolic > 90) ? 0.85 :
                        (patientData.antenatalVisit < 4) ? 0.65 : 0.25,
                recommendations: (patientData.age <= 16 && patientData.gravidity >= 2) ? [
                    "Immediate consultation with obstetric specialist required",
                    "Increased frequency of antenatal visits",
                    "Continuous fetal monitoring recommended"
                ] : (patientData.systolic > 140 || patientData.diastolic > 90) ? [
                    "Monitor blood pressure closely",
                    "Potential pre-eclampsia risk - consult specialist",
                    "Reduce salt intake and increase rest"
                ] : (patientData.antenatalVisit < 4) ? [
                    "Schedule additional antenatal visits",
                    "Educate on importance of regular checkups",
                    "Monitor for any complications"
                ] : [
                    "Continue with regular antenatal check-ups",
                    "Maintain balanced diet with adequate protein and iron",
                    "Moderate exercise recommended"
                ],
                timestamp: new Date().toISOString(),
                inputFeatures: patientData
            };

            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            setApiResponse(mockResponse);
            savePatient(mockResponse);
            setRetryCount(0);
            return mockResponse;
        } catch (err: any) {
            console.error('Error:', err);
            setError('An unexpected error occurred');
            return null;
        } finally {
            setLoading(false);
        }
    };

    // const predictRisk = async () => {
    //     const validationErrors = validateForm();
    //     if (validationErrors.length > 0) {
    //         setError(validationErrors.join(". "));
    //         return null;
    //     }

    //     setLoading(true);
    //     setError(null);

    //     try {
    //         const response = await api.post('/api/predict', {
    //             patientId: `patient-${Date.now()}`,
    //             patientName: patientData.name,
    //             age: patientData.age,
    //             location: patientData.location,
    //             chronicCondition: patientData.chronicCondition,
    //             previousPregnancyComplication: patientData.previousPregnancyComplication,
    //             gestationAge: patientData.gestationAge,
    //             gravidity: patientData.gravidity,
    //             parity: patientData.parity,
    //             antenatalVisit: patientData.antenatalVisit,
    //             systolic: patientData.systolic,
    //             diastolic: patientData.diastolic,
    //             pulseRate: patientData.pulseRate,
    //             specificComplication: patientData.specificComplication,
    //             deliveryMode: patientData.deliveryMode,
    //             staffConductedDelivery: patientData.staffConductedDelivery
    //         });

    //         const apiData: ApiResponse = response.data;
    //         setApiResponse(apiData);
    //         savePatient(apiData);
    //         setRetryCount(0);
    //         return apiData;
    //     } catch (err: any) {
    //         console.error('API Error:', err);
    //         let errorMessage = 'Failed to get prediction';

    //         if (err.code === 'ECONNABORTED') {
    //             errorMessage = 'Request timed out. Please try again.';
    //             if (retryCount < 2) {
    //                 setRetryCount(prev => prev + 1);
    //                 setTimeout(predictRisk, 2000);
    //                 return;
    //             }
    //         } else if (err.response) {
    //             errorMessage = err.response.data?.error || err.response.statusText;
    //         } else if (err.request) {
    //             errorMessage = 'No response from server. Please check your internet connection.';
    //         } else {
    //             errorMessage = err.message;
    //         }

    //         setError(errorMessage);
    //         return null;
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    const savePatient = (apiData: ApiResponse) => {
        const newPatient: Patient = {
            id: apiData.patientId,
            name: patientData.name,
            age: patientData.age,
            location: patientData.location,
            gestationAge: patientData.gestationAge,
            gravidity: patientData.gravidity,
            parity: patientData.parity,
            antenatalVisit: patientData.antenatalVisit,
            systolic: patientData.systolic,
            diastolic: patientData.diastolic,
            pulseRate: patientData.pulseRate,
            status: apiData.riskLevel,
            probability: apiData.probability,
            lastCheckup: new Date().toISOString().split('T')[0],
            recommendations: apiData.recommendations
        };

        const updatedPatients = [...patients, newPatient];
        setPatients(updatedPatients);
        localStorage.setItem('maternal-patients', JSON.stringify(updatedPatients));
    };

    const deletePatient = (id: string) => {
        const updatedPatients = patients.filter(patient => patient.id !== id);
        setPatients(updatedPatients);
        localStorage.setItem('maternal-patients', JSON.stringify(updatedPatients));
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-950 to-blue-800 text-white">
            <header className="bg-blue-900 p-4 shadow-md">
                <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
                    <h1 className="text-2xl font-bold text-center sm:text-left">MATERNAL HEALTH RISK ASSESSMENT</h1>
                    <nav className="flex flex-wrap justify-center gap-2 sm:gap-4">
                        <button
                            onClick={() => setActiveTab('home')}
                            className={`px-3 py-1 sm:px-4 sm:py-2 rounded-lg ${activeTab === 'home' ? 'bg-blue-700' : 'hover:bg-blue-800'}`}
                        >
                            Home
                        </button>
                        <button
                            onClick={() => setActiveTab('test')}
                            className={`px-3 py-1 sm:px-4 sm:py-2 rounded-lg ${activeTab === 'test' ? 'bg-blue-700' : 'hover:bg-blue-800'}`}
                        >
                            Risk Assessment
                        </button>
                        <button
                            onClick={() => router.push('/')}
                            className="bg-blue-600 hover:bg-blue-700 px-3 py-1 sm:px-4 sm:py-2 rounded-lg"
                        >
                            Logout
                        </button>
                    </nav>
                </div>
            </header>

            <main className="container mx-auto p-4">
                {activeTab === 'home' && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold">Patient Dashboard</h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                            <div className="bg-blue-800 bg-opacity-50 p-4 sm:p-6 rounded-lg border border-blue-600">
                                <h3 className="text-lg sm:text-xl font-semibold">Total Patients</h3>
                                <p className="text-3xl sm:text-4xl font-bold text-blue-300">{patients.length}</p>
                            </div>
                            <div className="bg-blue-800 bg-opacity-50 p-4 sm:p-6 rounded-lg border border-blue-600">
                                <h3 className="text-lg sm:text-xl font-semibold">High Risk</h3>
                                <p className="text-3xl sm:text-4xl font-bold text-yellow-300">
                                    {patients.filter(p => p.status === 'High').length}
                                </p>
                            </div>
                            <div className="bg-blue-800 bg-opacity-50 p-4 sm:p-6 rounded-lg border border-blue-600">
                                <h3 className="text-lg sm:text-xl font-semibold">Low Risk</h3>
                                <p className="text-3xl sm:text-4xl font-bold text-blue-300">
                                    {patients.filter(p => p.status === 'Low').length}
                                </p>
                            </div>
                        </div>

                        <div className="bg-blue-800 bg-opacity-50 p-4 sm:p-6 rounded-lg border border-blue-600">
                            <h3 className="text-xl font-semibold mb-4">Recent Patients</h3>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-blue-600">
                                    <thead>
                                        <tr>
                                            <th className="px-4 py-2 sm:px-6 sm:py-3 text-left text-sm font-medium text-blue-300 uppercase">Name</th>
                                            <th className="px-4 py-2 sm:px-6 sm:py-3 text-left text-sm font-medium text-blue-300 uppercase">Age</th>
                                            <th className="px-4 py-2 sm:px-6 sm:py-3 text-left text-sm font-medium text-blue-300 uppercase">Location</th>
                                            <th className="px-4 py-2 sm:px-6 sm:py-3 text-left text-sm font-medium text-blue-300 uppercase">Status</th>
                                            <th className="px-4 py-2 sm:px-6 sm:py-3 text-left text-sm font-medium text-blue-300 uppercase">Last Checkup</th>
                                            <th className="px-4 py-2 sm:px-6 sm:py-3 text-left text-sm font-medium text-blue-300 uppercase">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-blue-700">
                                        {patients.slice(0, 5).map(patient => (
                                            <tr key={patient.id}>
                                                <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap">{patient.name}</td>
                                                <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap">{patient.age}</td>
                                                <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap">{patient.location}</td>
                                                <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${patient.status === 'High' ? 'bg-yellow-900 text-yellow-100' : 'bg-blue-900 text-blue-100'}`}>
                                                        {patient.status}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap">{patient.lastCheckup}</td>
                                                <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap">
                                                    <button
                                                        onClick={() => deletePatient(patient.id)}
                                                        className="text-red-400 hover:text-red-300"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                        </svg>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'test' && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold">Maternal Risk Assessment</h2>

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
                                    <div className="bg-blue-800 bg-opacity-50 p-4 rounded-lg border border-blue-600">
                                        <label className="block text-blue-200 mb-2">Patient Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={patientData.name}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 sm:px-4 sm:py-2 bg-blue-900 bg-opacity-30 border border-blue-500 rounded-lg"
                                            required
                                        />
                                    </div>
                                    <div className="bg-blue-800 bg-opacity-50 p-4 rounded-lg border border-blue-600">
                                        <label className="block text-blue-200 mb-2">Age (10-60)</label>
                                        <input
                                            type="number"
                                            name="age"
                                            value={patientData.age || ''}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 sm:px-4 sm:py-2 bg-blue-900 bg-opacity-30 border border-blue-500 rounded-lg"
                                            min="10"
                                            max="60"
                                            required
                                        />
                                    </div>
                                    <div className="bg-blue-800 bg-opacity-50 p-4 rounded-lg border border-blue-600">
                                        <label className="block text-blue-200 mb-2">District</label>
                                        <select
                                            name="location"
                                            value={patientData.location}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 sm:px-4 sm:py-2 bg-blue-900 bg-opacity-30 border border-blue-500 rounded-lg"
                                            required
                                        >
                                            <option value="">Select District</option>
                                            {MALAWI_DISTRICTS.map(district => (
                                                <option key={district} value={district}>{district}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="bg-blue-800 bg-opacity-50 p-4 rounded-lg border border-blue-600">
                                        <label className="block text-blue-200 mb-2">Gestation Age (weeks, 0-45)</label>
                                        <input
                                            type="number"
                                            name="gestationAge"
                                            value={patientData.gestationAge || ''}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 sm:px-4 sm:py-2 bg-blue-900 bg-opacity-30 border border-blue-500 rounded-lg"
                                            min="0"
                                            max="45"
                                            required
                                        />
                                    </div>
                                    <div className="bg-blue-800 bg-opacity-50 p-4 rounded-lg border border-blue-600">
                                        <label className="block text-blue-200 mb-2">Gravidity</label>
                                        <input
                                            type="number"
                                            name="gravidity"
                                            value={patientData.gravidity || ''}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 sm:px-4 sm:py-2 bg-blue-900 bg-opacity-30 border border-blue-500 rounded-lg"
                                            min="0"
                                            max="20"
                                            required
                                        />
                                    </div>
                                    <div className="bg-blue-800 bg-opacity-50 p-4 rounded-lg border border-blue-600">
                                        <label className="block text-blue-200 mb-2">Parity</label>
                                        <input
                                            type="number"
                                            name="parity"
                                            value={patientData.parity || ''}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 sm:px-4 sm:py-2 bg-blue-900 bg-opacity-30 border border-blue-500 rounded-lg"
                                            min="0"
                                            max="20"
                                            required
                                        />
                                    </div>
                                    <div className="bg-blue-800 bg-opacity-50 p-4 rounded-lg border border-blue-600">
                                        <label className="block text-blue-200 mb-2">Antenatal Visits</label>
                                        <input
                                            type="number"
                                            name="antenatalVisit"
                                            value={patientData.antenatalVisit || ''}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 sm:px-4 sm:py-2 bg-blue-900 bg-opacity-30 border border-blue-500 rounded-lg"
                                            min="0"
                                            max="20"
                                            required
                                        />
                                    </div>
                                    <div className="bg-blue-800 bg-opacity-50 p-4 rounded-lg border border-blue-600">
                                        <label className="block text-blue-200 mb-2">Systolic BP (mmHg, 50-300)</label>
                                        <input
                                            type="number"
                                            name="systolic"
                                            value={patientData.systolic || ''}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 sm:px-4 sm:py-2 bg-blue-900 bg-opacity-30 border border-blue-500 rounded-lg"
                                            min="50"
                                            max="300"
                                            required
                                        />
                                    </div>
                                    <div className="bg-blue-800 bg-opacity-50 p-4 rounded-lg border border-blue-600">
                                        <label className="block text-blue-200 mb-2">Diastolic BP (mmHg, 30-200)</label>
                                        <input
                                            type="number"
                                            name="diastolic"
                                            value={patientData.diastolic || ''}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 sm:px-4 sm:py-2 bg-blue-900 bg-opacity-30 border border-blue-500 rounded-lg"
                                            min="30"
                                            max="200"
                                            required
                                        />
                                    </div>
                                    <div className="bg-blue-800 bg-opacity-50 p-4 rounded-lg border border-blue-600">
                                        <label className="block text-blue-200 mb-2">Pulse Rate (bpm, 30-220)</label>
                                        <input
                                            type="number"
                                            name="pulseRate"
                                            value={patientData.pulseRate || ''}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 sm:px-4 sm:py-2 bg-blue-900 bg-opacity-30 border border-blue-500 rounded-lg"
                                            min="30"
                                            max="220"
                                            required
                                        />
                                    </div>
                                    <div className="bg-blue-800 bg-opacity-50 p-4 rounded-lg border border-blue-600">
                                        <label className="block text-blue-200 mb-2">Chronic Condition</label>
                                        <select
                                            name="chronicCondition"
                                            value={patientData.chronicCondition}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 sm:px-4 sm:py-2 bg-blue-900 bg-opacity-30 border border-blue-500 rounded-lg"
                                            required
                                        >
                                            <option value="No">No</option>
                                            <option value="Yes">Yes</option>
                                        </select>
                                    </div>
                                    <div className="bg-blue-800 bg-opacity-50 p-4 rounded-lg border border-blue-600">
                                        <label className="block text-blue-200 mb-2">Previous Pregnancy Complication</label>
                                        <select
                                            name="previousPregnancyComplication"
                                            value={patientData.previousPregnancyComplication}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 sm:px-4 sm:py-2 bg-blue-900 bg-opacity-30 border border-blue-500 rounded-lg"
                                            required
                                        >
                                            <option value="No">No</option>
                                            <option value="Yes">Yes</option>
                                        </select>
                                    </div>
                                    <div className="bg-blue-800 bg-opacity-50 p-4 rounded-lg border border-blue-600">
                                        <label className="block text-blue-200 mb-2">Specific Complication</label>
                                        <select
                                            name="specificComplication"
                                            value={patientData.specificComplication}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 sm:px-4 sm:py-2 bg-blue-900 bg-opacity-30 border border-blue-500 rounded-lg"
                                            required
                                        >
                                            <option value="No">No</option>
                                            <option value="Yes">Yes</option>
                                        </select>
                                    </div>
                                    <div className="bg-blue-800 bg-opacity-50 p-4 rounded-lg border border-blue-600">
                                        <label className="block text-blue-200 mb-2">Delivery Mode</label>
                                        <select
                                            name="deliveryMode"
                                            value={patientData.deliveryMode}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 sm:px-4 sm:py-2 bg-blue-900 bg-opacity-30 border border-blue-500 rounded-lg"
                                            required
                                        >
                                            <option value="Spontaneous Vertex Delivery">Spontaneous Vertex Delivery</option>
                                            <option value="Caesarean Section">Caesarean Section</option>
                                        </select>
                                    </div>
                                    <div className="bg-blue-800 bg-opacity-50 p-4 rounded-lg border border-blue-600">
                                        <label className="block text-blue-200 mb-2">Staff Conducted Delivery</label>
                                        <select
                                            name="staffConductedDelivery"
                                            value={patientData.staffConductedDelivery}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 sm:px-4 sm:py-2 bg-blue-900 bg-opacity-30 border border-blue-500 rounded-lg"
                                            required
                                        >
                                            <option value="Skilled">Skilled</option>
                                            <option value="Unskilled">Unskilled</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex justify-center">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-medium text-lg flex items-center gap-2"
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
                                            'Assess Maternal Risk'
                                        )}
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="space-y-6">
                                <div className="bg-blue-800 bg-opacity-50 p-6 rounded-lg border border-blue-600">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <div className="bg-blue-900 bg-opacity-30 p-4 rounded-lg">
                                                <h4 className="text-blue-300 font-medium">Patient Information</h4>
                                                <div className="mt-2 space-y-2">
                                                    <p><span className="font-medium">Name:</span> {patientData.name}</p>
                                                    <p><span className="font-medium">Age:</span> {patientData.age}</p>
                                                    <p><span className="font-medium">District:</span> {patientData.location}</p>
                                                    <p><span className="font-medium">Gestation Age:</span> {patientData.gestationAge} weeks</p>
                                                </div>
                                            </div>

                                            <div className="bg-blue-900 bg-opacity-30 p-4 rounded-lg">
                                                <h4 className="text-blue-300 font-medium">Medical Information</h4>
                                                <div className="mt-2 space-y-2">
                                                    <p><span className="font-medium">Gravidity:</span> {patientData.gravidity}</p>
                                                    <p><span className="font-medium">Parity:</span> {patientData.parity}</p>
                                                    <p><span className="font-medium">Antenatal Visits:</span> {patientData.antenatalVisit}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="bg-blue-900 bg-opacity-30 p-4 rounded-lg">
                                                <h4 className="text-blue-300 font-medium">Vital Signs</h4>
                                                <div className="mt-2 space-y-2">
                                                    <p><span className="font-medium">Blood Pressure:</span> {patientData.systolic}/{patientData.diastolic} mmHg</p>
                                                    <p><span className="font-medium">Pulse Rate:</span> {patientData.pulseRate} bpm</p>
                                                </div>
                                            </div>

                                            <div className="bg-blue-900 bg-opacity-30 p-4 rounded-lg">
                                                <h4 className="text-blue-300 font-medium">Risk Assessment</h4>
                                                <div className="mt-2 space-y-2">
                                                    <p className="flex items-center gap-2">
                                                        <span className="font-medium">Status:</span>
                                                        <span className={`px-2 py-1 rounded-full text-sm font-medium ${apiResponse.riskLevel === 'High' ? 'bg-yellow-900 text-yellow-100' : 'bg-blue-900 text-blue-100'}`}>
                                                            {apiResponse.riskLevel} Risk
                                                        </span>
                                                    </p>
                                                    <p><span className="font-medium">Probability:</span> {(apiResponse.probability * 100).toFixed(1)}%</p>
                                                    <p><span className="font-medium">Date:</span> {new Date().toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-blue-800 bg-opacity-50 p-6 rounded-lg border border-blue-600">
                                    <h3 className="text-xl font-semibold mb-4">Recommendations</h3>
                                    <ul className="list-disc list-inside space-y-2 pl-4">
                                        {apiResponse.recommendations.map((rec, i) => (
                                            <li key={i}>{rec}</li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="bg-blue-800 bg-opacity-50 p-6 rounded-lg border border-blue-600">
                                    <div className="flex flex-wrap gap-4 justify-center">
                                        <button
                                            onClick={() => setApiResponse(null)}
                                            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-medium flex items-center gap-2"
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
        </div>
    );
}




// const predictRisk = async () => {
//   const validationErrors = validateForm();
//   if (validationErrors.length > 0) {
//     setError(validationErrors.join(". "));
//     return null;
//   }

//   setLoading(true);
//   setError(null);

//   try {
//     // Send request to backend
//     const response = await api.post('/api/assess', {
//       ...patientData,
//       use_model: false // Set to true when you want to use the model
//     });

//     // Save the response
//     setApiResponse(response.data);
//     savePatient(response.data);
//     setRetryCount(0);
//     return response.data;
//   } catch (err: any) {
//     console.error('Error:', err);
    
//     // Handle specific error cases
//     if (err.response) {
//       // The request was made and the server responded with a status code
//       if (err.response.data && err.response.data.details) {
//         setError(err.response.data.details.join(". "));
//       } else {
//         setError(err.response.data?.message || 'An error occurred');
//       }
//     } else if (err.request) {
//       // The request was made but no response was received
//       setError('No response from server. Please check your connection.');
//     } else {
//       // Something happened in setting up the request
//       setError('An unexpected error occurred');
//     }
    
//     // Retry logic (optional)
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



// const savePatient = (apiData: ApiResponse) => {
//   const newPatient: Patient = {
//     id: apiData.patientId,
//     name: apiData.patientName,
//     age: apiData.inputFeatures.age,
//     location: apiData.inputFeatures.location,
//     gestationAge: apiData.inputFeatures.gestationAge,
//     gravidity: apiData.inputFeatures.gravidity,
//     parity: apiData.inputFeatures.parity,
//     antenatalVisit: apiData.inputFeatures.antenatalVisit,
//     systolic: apiData.inputFeatures.systolic,
//     diastolic: apiData.inputFeatures.diastolic,
//     pulseRate: apiData.inputFeatures.pulseRate,
//     status: apiData.riskLevel,
//     probability: apiData.probability,
//     lastCheckup: new Date(apiData.timestamp).toISOString().split('T')[0],
//     recommendations: apiData.recommendations
//   };

//   const updatedPatients = [...patients, newPatient];
//   setPatients(updatedPatients);
//   localStorage.setItem('maternal-patients', JSON.stringify(updatedPatients));
// };