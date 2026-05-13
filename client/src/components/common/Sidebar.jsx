// import { useState } from 'react';
// import { NavLink } from 'react-router-dom';
// import { useNavigate } from "react-router-dom";
// function Sidebar() {
//   const [isOpen, setIsOpen] = useState(false);

//   const navItems = [
//     { path: '/PendingTodo', label: 'Pending Todos', icon: 'M9 12l2 2 4-4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11' },
//     { path: '/CompletedTodo', label: 'Completed Todos', icon: 'M20 6L9 17l-5-5' },
//     { path: '/PendingSubTodo', label: 'Pending SubTodos', icon: 'M9 12l2 2 4-4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11' },
//     { path: '/CompletedSubTodo', label: 'Completed SubTodo', icon: 'M20 6L9 17l-5-5' },
//   ];
 

//   return (
//     <>
//       {/* Mobile Hamburger Button */}
//       <button
//         onClick={() => setIsOpen(!isOpen)}
//         className="md:hidden fixed top-6 left-6 z-50 flex items-center justify-center w-10 h-10 rounded-lg bg-[#c07057] hover:bg-[#a85e47] text-white transition-colors"
//         aria-label="Toggle sidebar"
//       >
//         {isOpen ? (
//           <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//           </svg>
//         ) : (
//           <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//           </svg>
//         )}
//       </button>

//       {/* Mobile Overlay */}
//       {isOpen && (
//         <div
//           className="md:hidden fixed inset-0 z-30 bg-black/40"
//           onClick={() => setIsOpen(false)}
//         />
//       )}

//       {/* Sidebar */}
//       <div
//         className={`fixed md:static top-0 left-0 h-full w-64 bg-[#f4ede4] shadow-xl z-40 p-8 rounded-r-2xl transition-transform duration-300 transform md:transform-none ${
//           isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
//         }`}
//       >
//         <div className="flex flex-col gap-6">
//           {/* Logo/Brand */}
//           <div className="mb-4">
//             <h1 className="text-2xl font-bold text-[#2c2416]">Scaloy</h1>
//             <p className="text-xs text-[#7a6e5f] mt-1">Task Management</p>
           
//           </div>

//           {/* Navigation */}
//           <div>
//             <span className="text-xs font-semibold tracking-[0.3em] uppercase text-[#7a6e5f]">Views</span>
//             <nav className="flex flex-col gap-3 mt-4">
//               {navItems.map((item) => (
//                 <NavLink
//                   key={item.path}
//                   to={item.path}
//                   onClick={() => setIsOpen(false)}
//                   className={({ isActive }) =>
//                     `group flex items-center gap-3 rounded-3xl px-4 py-3 transition-all duration-200 ${
//                       isActive
//                         ? 'bg-[#1a2438] text-white shadow-[0_16px_40px_-28px_rgba(0,0,0,0.8)]'
//                         : 'bg-white text-[#2c2416] hover:bg-[#f8e7de] hover:text-[#2c2416] border border-[#e8dfd6]'
//                     }`
//                   }
//                 >
//                   <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#e8ddd3] text-[#6d6559] transition-colors duration-200 group-hover:bg-[#c07057] group-hover:text-white">
//                     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
//                       <path d={item.icon} />
//                     </svg>
//                   </span>
//                   <span className="font-semibold text-sm">{item.label}</span>
//                 </NavLink>
//               ))}
//             </nav>
//           </div>
//         </div>
//       </div>

//       {/* Main Content Wrapper */}
//       <div className="flex-1 md:ml-0 min-h-screen bg-[#edeae4]">
//         {/* Content will be inserted here */}
//       </div>
//     </>
//   );
// }

// export default Sidebar;
