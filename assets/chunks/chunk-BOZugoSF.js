const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/chunks/chunk-BgFcsJyw.js","assets/chunks/chunk-NnsilhFv.js","assets/chunks/chunk-BIVpqUci.js","assets/static/vike-react-cc21853d.BcWtY8Ol.css","assets/static/layouts_style-b34a8e57.c_1FbwL7.css","assets/static/layouts_tailwind-00e65532.BZqQmOMT.css","assets/chunks/chunk-yrsSxuPR.js","assets/chunks/chunk-IUYf3yx-.js"])))=>i.map(i=>d[i]);
import{r as y,j as e,R as G,w as xe}from"./chunk-NnsilhFv.js";import{c as ne,u as $e}from"./chunk-yrsSxuPR.js";import{_ as ee}from"./chunk-IUYf3yx-.js";import{C as Te,f as Ge,a as Ue,g as Ve,s as Ze,b as M,c as K,d as He,G as We,e as qe}from"./chunk-BgFcsJyw.js";const fe={currentDeck:null,isEditing:!1,hasUnsavedChanges:!1,isCardBuilderOpen:!1,editingCard:null,editingCardIndex:null,draggedCard:null,undoStack:[],redoStack:[]},J=()=>`card-${Date.now()}-${Math.random().toString(36).substr(2,9)}`,z=ne((t,s)=>({...fe,setCurrentDeck:n=>{t({currentDeck:n,isEditing:n!==null,hasUnsavedChanges:!1})},updateDeckMetadata:n=>{const{currentDeck:r}=s();if(!r)return;const a={...r,...n,metadata:{...r.metadata,modified:new Date}};t({currentDeck:a,hasUnsavedChanges:!0})},markUnsavedChanges:n=>{t({hasUnsavedChanges:n})},updateMetadataSchema:n=>{const{currentDeck:r}=s();if(!r)return;const a={...r,metadataSchema:n,metadata:{...r.metadata,modified:new Date}};t({currentDeck:a,hasUnsavedChanges:!0})},addCardToDeck:n=>{const{currentDeck:r}=s();if(!r)return;const a={...n,id:n.id||J()},i={...r,baseCards:[...r.baseCards,a],metadata:{...r.metadata,modified:new Date}};t({currentDeck:i,hasUnsavedChanges:!0})},updateCardInDeck:(n,r)=>{const{currentDeck:a}=s();if(!a||n<0||n>=a.baseCards.length)return;const i=[...a.baseCards];i[n]={...r,id:r.id||J()};const o={...a,baseCards:i,metadata:{...a.metadata,modified:new Date}};t({currentDeck:o,hasUnsavedChanges:!0})},updateZoneMetadata:(n,r,a,i)=>{const{currentDeck:o}=s();if(!o||n<0||n>=o.baseCards.length)return;const l=o.baseCards[n];if(!l.cells[r]||!l.cells[r][a])return;const c=[...o.baseCards],d={...l};d.cells=l.cells.map((g,h)=>h!==r?g:g.map((C,j)=>j!==a?C:{...C,customMetadata:i})),c[n]=d;const m={...o,baseCards:c,metadata:{...o.metadata,modified:new Date}};t({currentDeck:m,hasUnsavedChanges:!0})},updateZoneTypeDefaultMetadata:(n,r)=>{const{currentDeck:a}=s();if(!a)return;const i=a.zoneTypes.map(l=>l.id===n?{...l,defaultMetadata:r}:l),o={...a,zoneTypes:i,metadata:{...a.metadata,modified:new Date}};t({currentDeck:o,hasUnsavedChanges:!0})},removeCardFromDeck:n=>{const{currentDeck:r}=s();if(!r||n<0||n>=r.baseCards.length)return;const a=r.baseCards.filter((o,l)=>l!==n),i={...r,baseCards:a,metadata:{...r.metadata,modified:new Date}};t({currentDeck:i,hasUnsavedChanges:!0})},duplicateCardInDeck:n=>{const{currentDeck:r}=s();if(!r||n<0||n>=r.baseCards.length)return;const a=r.baseCards[n],i={...a,id:J(),name:a.name?`${a.name} (Copy)`:void 0},o=[...r.baseCards.slice(0,n+1),i,...r.baseCards.slice(n+1)],l={...r,baseCards:o,metadata:{...r.metadata,modified:new Date}};t({currentDeck:l,hasUnsavedChanges:!0})},openCardBuilder:(n,r)=>{const{currentDeck:a}=s(),i=a?.zoneTypes?.[0]?.id||"residential",o=n||{id:J(),cells:[[{type:i,roads:[]},{type:i,roads:[]}],[{type:i,roads:[]},{type:i,roads:[]}]],count:1};t({isCardBuilderOpen:!0,editingCard:o,editingCardIndex:r??null})},closeCardBuilder:()=>{t({isCardBuilderOpen:!1,editingCard:null,editingCardIndex:null}),s().clearHistory()},setEditingCard:n=>{n&&s().editingCard&&s().pushToUndo(s().editingCard),t({editingCard:n})},setDraggedCard:n=>{t({draggedCard:n})},pushToUndo:n=>{const{undoStack:r}=s();t({undoStack:[...r,n],redoStack:[]})},undo:()=>{const{undoStack:n,redoStack:r,editingCard:a}=s();if(n.length===0)return null;const i=n[n.length-1],o=n.slice(0,-1);return a&&t({editingCard:i,undoStack:o,redoStack:[...r,a]}),i},redo:()=>{const{redoStack:n,undoStack:r,editingCard:a}=s();if(n.length===0)return null;const i=n[n.length-1],o=n.slice(0,-1);return a&&t({editingCard:i,redoStack:o,undoStack:[...r,a]}),i},clearHistory:()=>{t({undoStack:[],redoStack:[]})},addScoringCondition:n=>{const{currentDeck:r}=s();if(!r)return;const a=[...r.customScoringConditions||[],n],i={...r,customScoringConditions:a,metadata:{...r.metadata,modified:new Date}};t({currentDeck:i,hasUnsavedChanges:!0})},updateScoringCondition:(n,r)=>{const{currentDeck:a}=s();if(!a)return;const i=(a.customScoringConditions||[]).map(l=>l.id===n?{...l,...r,updatedAt:new Date}:l),o={...a,customScoringConditions:i,metadata:{...a.metadata,modified:new Date}};t({currentDeck:o,hasUnsavedChanges:!0})},removeScoringCondition:n=>{const{currentDeck:r}=s();if(!r)return;const a=(r.customScoringConditions||[]).filter(l=>l.id!==n),i=r.baseCards.map(l=>{if(l.scoringConditionId===n){const{scoringConditionId:c,...d}=l;return d}return l}),o={...r,baseCards:i,customScoringConditions:a,metadata:{...r.metadata,modified:new Date}};t({currentDeck:o,hasUnsavedChanges:!0})},getScoringCondition:n=>{const{currentDeck:r}=s();if(r)return(r.customScoringConditions||[]).find(a=>a.id===n)},reset:()=>{t(fe)}}));function Ye(){const{currentDeck:t,updateDeckMetadata:s}=z(),[n,r]=y.useState({name:"",color:"#60a5fa",description:""});if(!t)return null;const a=()=>{if(!n.name?.trim())return;const c={id:n.name.toLowerCase().replace(/[^a-z0-9]/g,"_"),name:n.name.trim(),color:n.color||"#60a5fa",description:n.description?.trim()||""};if(t.zoneTypes.some(d=>d.id===c.id)){alert("A zone type with this name already exists");return}s({zoneTypes:[...t.zoneTypes,c]}),r({name:"",color:"#60a5fa",description:""})},i=(c,d)=>{const m=t.zoneTypes.map((g,h)=>h===c?{...g,...d}:g);s({zoneTypes:m})},o=c=>{const d=t.zoneTypes[c];if(t.baseCards.some(h=>h.cells.some(C=>C.some(j=>j.type===d.id)))&&!confirm(`This zone type is used in ${t.baseCards.filter(C=>C.cells.some(j=>j.some(N=>N.type===d.id))).length} card(s). Deleting it will break those cards. Continue?`))return;const g=t.zoneTypes.filter((h,C)=>C!==c);s({zoneTypes:g})},l=[{name:"Residential",color:"#60a5fa",description:"Housing areas"},{name:"Commercial",color:"#f59e0b",description:"Business districts"},{name:"Industrial",color:"#6b7280",description:"Manufacturing zones"},{name:"Park",color:"#34d399",description:"Green spaces"},{name:"Casino",color:"#dc2626",description:"Gaming floors"},{name:"Hotel",color:"#7c3aed",description:"Accommodation"},{name:"Entertainment",color:"#06b6d4",description:"Shows and venues"},{name:"Dining",color:"#f59e0b",description:"Restaurants and bars"},{name:"Fields",color:"#84cc16",description:"Farmland and crops"},{name:"Livestock",color:"#a78bfa",description:"Animal farming"},{name:"Orchards",color:"#34d399",description:"Fruit trees"},{name:"Buildings",color:"#f59e0b",description:"Farm buildings"}];return e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx("h4",{className:"font-medium text-gray-700",children:"Zone Types"}),e.jsxs("span",{className:"text-xs text-gray-500",children:[t.zoneTypes.length," types"]})]}),e.jsx("div",{className:"space-y-3",children:t.zoneTypes.map((c,d)=>e.jsx("div",{className:"group border border-gray-200 rounded-lg p-3 hover:border-gray-300 transition-colors",children:e.jsxs("div",{className:"flex items-start gap-3",children:[e.jsx("input",{type:"color",className:"w-8 h-8 rounded border border-gray-300 cursor-pointer flex-shrink-0",value:c.color,onChange:m=>i(d,{color:m.target.value}),title:"Zone color"}),e.jsxs("div",{className:"flex-1 min-w-0 space-y-2",children:[e.jsx("input",{type:"text",className:"w-full text-sm font-medium bg-transparent border-0 p-0 focus:ring-0 focus:outline-none focus:bg-white focus:border focus:border-blue-500 focus:rounded focus:px-2 focus:py-1",value:c.name,onChange:m=>i(d,{name:m.target.value}),placeholder:"Zone name"}),e.jsx("input",{type:"text",className:"w-full text-xs text-gray-600 bg-transparent border-0 p-0 focus:ring-0 focus:outline-none focus:bg-white focus:border focus:border-blue-500 focus:rounded focus:px-2 focus:py-1",placeholder:"Optional description",value:c.description||"",onChange:m=>i(d,{description:m.target.value})})]}),e.jsx("button",{onClick:()=>o(d),className:"opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 p-1 transition-opacity",title:"Delete zone type",children:e.jsx("svg",{className:"w-4 h-4",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M6 18L18 6M6 6l12 12"})})})]})},c.id))}),e.jsxs("div",{className:"border-t pt-4",children:[e.jsxs("details",{className:"group",children:[e.jsxs("summary",{className:"cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900 flex items-center gap-2",children:[e.jsx("svg",{className:"w-4 h-4 transition-transform group-open:rotate-90",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M9 5l7 7-7 7"})}),"Add Zone Type"]}),e.jsxs("div",{className:"mt-3 space-y-2",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("input",{type:"color",className:"w-8 h-8 rounded border border-gray-300 cursor-pointer",value:n.color,onChange:c=>r({...n,color:c.target.value}),title:"Zone color"}),e.jsx("input",{type:"text",className:"input input-bordered input-sm flex-1",placeholder:"Zone name",value:n.name,onChange:c=>r({...n,name:c.target.value})})]}),e.jsx("input",{type:"text",className:"input input-bordered input-sm w-full",placeholder:"Description (optional)",value:n.description,onChange:c=>r({...n,description:c.target.value})}),e.jsx("button",{onClick:a,disabled:!n.name?.trim(),className:"btn btn-primary btn-sm w-full",children:"Add Zone Type"})]})]}),e.jsxs("div",{className:"mt-4",children:[e.jsx("h6",{className:"text-xs font-medium text-gray-600 mb-2",children:"Quick Add from Presets:"}),e.jsx("div",{className:"grid grid-cols-2 gap-2",children:l.map(c=>e.jsxs("button",{onClick:()=>r(c),className:"btn btn-xs btn-outline justify-start gap-2",disabled:t.zoneTypes.some(d=>d.name.toLowerCase()===c.name.toLowerCase()),children:[e.jsx("div",{className:"w-3 h-3 rounded border",style:{backgroundColor:c.color}}),c.name]},c.name))})]})]}),t.baseCards.length>0&&e.jsxs("div",{className:"bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs",children:[e.jsx("div",{className:"font-medium text-blue-900 mb-1",children:"Zone Usage in Cards:"}),t.zoneTypes.map(c=>{const d=t.baseCards.reduce((m,g)=>m+g.cells.flat().filter(h=>h.type===c.id).length,0);return d>0?e.jsxs("div",{className:"text-blue-700",children:[c.name,": ",d," cell",d!==1?"s":""]},c.id):null})]})]})}function Ke(){const{currentDeck:t,updateDeckMetadata:s}=z();if(!t)return null;const n=o=>{s({name:o.target.value})},r=o=>{s({description:o.target.value})},a=(o,l)=>{s({theme:{...t.theme,[o]:l}})},i=[{name:"Purple",primary:"#8b5cf6",secondary:"#7c3aed"},{name:"Blue",primary:"#3b82f6",secondary:"#1e40af"},{name:"Green",primary:"#22c55e",secondary:"#15803d"},{name:"Orange",primary:"#f59e0b",secondary:"#d97706"},{name:"Red",primary:"#ef4444",secondary:"#dc2626"},{name:"Teal",primary:"#14b8a6",secondary:"#0d9488"}];return e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"form-control",children:[e.jsx("label",{className:"label",children:e.jsx("span",{className:"label-text font-medium",children:"Deck Name"})}),e.jsx("input",{type:"text",className:"input input-bordered w-full",value:t.name,onChange:n,placeholder:"Enter deck name"})]}),e.jsxs("div",{className:"form-control",children:[e.jsx("label",{className:"label",children:e.jsx("span",{className:"label-text font-medium",children:"Description"})}),e.jsx("textarea",{className:"textarea textarea-bordered h-20 resize-none",value:t.description,onChange:r,placeholder:"Describe your deck..."})]}),e.jsxs("div",{className:"form-control",children:[e.jsx("label",{className:"label",children:e.jsx("span",{className:"label-text font-medium",children:"Theme Colors"})}),e.jsx("div",{className:"grid grid-cols-2 gap-2 mb-3",children:i.map(o=>e.jsx("button",{className:`btn btn-sm justify-start ${t.theme.primaryColor===o.primary?"btn-primary":"btn-outline"}`,onClick:()=>a("primaryColor",o.primary),onDoubleClick:()=>{a("primaryColor",o.primary),a("secondaryColor",o.secondary)},children:e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("div",{className:"w-3 h-3 rounded border border-gray-300",style:{backgroundColor:o.primary}}),o.name]})},o.name))}),e.jsxs("div",{className:"grid grid-cols-1 gap-3",children:[e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("label",{className:"text-sm text-gray-600 w-16",children:"Primary:"}),e.jsx("input",{type:"color",className:"input input-bordered input-sm w-16 h-8 p-1",value:t.theme.primaryColor,onChange:o=>a("primaryColor",o.target.value)}),e.jsx("input",{type:"text",className:"input input-bordered input-sm flex-1",value:t.theme.primaryColor,onChange:o=>a("primaryColor",o.target.value)})]}),e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("label",{className:"text-sm text-gray-600 w-16",children:"Secondary:"}),e.jsx("input",{type:"color",className:"input input-bordered input-sm w-16 h-8 p-1",value:t.theme.secondaryColor,onChange:o=>a("secondaryColor",o.target.value)}),e.jsx("input",{type:"text",className:"input input-bordered input-sm flex-1",value:t.theme.secondaryColor,onChange:o=>a("secondaryColor",o.target.value)})]})]})]}),e.jsx("div",{className:"form-control",children:e.jsx(Ye,{})}),e.jsxs("div",{className:"text-sm text-gray-500 space-y-1 pt-4 border-t",children:[e.jsxs("p",{children:[e.jsx("strong",{children:"Author:"})," ",t.metadata.author]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Version:"})," ",t.metadata.version]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Created:"})," ",new Date(t.metadata.created).toLocaleDateString()]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Modified:"})," ",new Date(t.metadata.modified).toLocaleDateString()]})]})]})}const le={formula:"",testResults:new Map,isCompiling:!1,isTesting:!1},Je=`// Custom Scoring Formula
// Available context: gameState, board utilities, scoring helpers

function calculateScore(context: ScoringContext): number {
  const { countZonesOfType, findLargestCluster } = context;
  
  // Example: Bonus for balanced development
  const residential = countZonesOfType('residential');
  const commercial = countZonesOfType('commercial');
  const industrial = countZonesOfType('industrial');
  
  const balance = Math.min(residential, commercial, industrial);
  return balance * 2; // 2 points per balanced zone
}`,se=ne((t,s)=>({...le,isOpen:!1,isGlobal:!1,formulaName:"",formulaDescription:"",targetContribution:10,openEditor:n=>{t({isOpen:!0,editingCondition:n,isGlobal:n?.isGlobal||!1,formulaName:n?.name||"",formulaDescription:n?.description||"",targetContribution:n?.targetContribution||10,formula:n?.formula||Je,testResults:new Map,compilationResult:void 0,selectedTestCase:void 0})},closeEditor:()=>{t({isOpen:!1,editingCondition:void 0,isGlobal:!1,formulaName:"",formulaDescription:"",targetContribution:10,...le})},setIsGlobal:n=>{t({isGlobal:n})},updateFormulaName:n=>{t({formulaName:n})},updateFormulaDescription:n=>{t({formulaDescription:n})},updateTargetContribution:n=>{t({targetContribution:n})},updateFormula:n=>{t({formula:n}),setTimeout(()=>{s().formula===n&&s().compileFormula(n)},500)},compileFormula:async n=>{t({isCompiling:!0});try{const{compileTypeScript:r}=await ee(async()=>{const{compileTypeScript:i}=await import("./chunk-BgFcsJyw.js").then(o=>o.t);return{compileTypeScript:i}},__vite__mapDeps([0,1,2,3,4,5,6,7])),a=await r(n);t({compilationResult:a,isCompiling:!1}),a.success&&s().runAllTests()}catch(r){t({compilationResult:{source:n,compiled:"",success:!1,error:r instanceof Error?r.message:"Compilation failed"},isCompiling:!1})}},addTestCase:n=>{const{editingCondition:r}=s();r&&(r.testCases.push(n),t({editingCondition:r}))},removeTestCase:n=>{const{editingCondition:r,testResults:a}=s();r&&(r.testCases=r.testCases.filter(i=>i.id!==n),a.delete(n),t({editingCondition:r,testResults:new Map(a)}))},runTest:async n=>{const{compilationResult:r,editingCondition:a}=s();if(!(!r?.success||!a)){t({isTesting:!0});try{const i=a.testCases.find(d=>d.id===n);if(!i)return;const{executeScoringFormula:o}=await ee(async()=>{const{executeScoringFormula:d}=await Promise.resolve().then(()=>An);return{executeScoringFormula:d}},void 0),l=await o(r.compiled,i.boardState),{testResults:c}=s();c.set(n,l),t({testResults:new Map(c),isTesting:!1})}catch(i){const{testResults:o}=s();o.set(n,{score:0,executionTime:0,error:i instanceof Error?i.message:"Execution failed"}),t({testResults:new Map(o),isTesting:!1})}}},runAllTests:async()=>{const{editingCondition:n}=s();if(n)for(const r of n.testCases)await s().runTest(r.id)},selectTestCase:n=>{const{selectedTestCase:r}=s();t({selectedTestCase:r===n?void 0:n})},saveCondition:()=>{const{formula:n,compilationResult:r,editingCondition:a,isGlobal:i,formulaName:o,formulaDescription:l,targetContribution:c}=s();if(!r?.success)return null;const d=new Date;return{id:a?.id||`custom_${Date.now()}`,name:o||"Custom Scoring Condition",description:l||"Custom TypeScript scoring formula",isCustom:!0,isGlobal:i,formula:n,compiledFormula:r.compiled,testCases:a?.testCases||[],createdAt:a?.createdAt||d,updatedAt:d,targetContribution:c,evaluate:()=>0,evaluateWithDetails:()=>({points:0,relevantTiles:[],description:""})}},cancelEditing:()=>{s().closeEditor()},loadTemplate:n=>{t({formula:n.code,compilationResult:void 0,testResults:new Map}),s().compileFormula(n.code)},reset:()=>{t(le)}}));function Xe(t,s,n){return s in t?Object.defineProperty(t,s,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[s]=n,t}function be(t,s){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);s&&(r=r.filter(function(a){return Object.getOwnPropertyDescriptor(t,a).enumerable})),n.push.apply(n,r)}return n}function ye(t){for(var s=1;s<arguments.length;s++){var n=arguments[s]!=null?arguments[s]:{};s%2?be(Object(n),!0).forEach(function(r){Xe(t,r,n[r])}):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):be(Object(n)).forEach(function(r){Object.defineProperty(t,r,Object.getOwnPropertyDescriptor(n,r))})}return t}function Qe(t,s){if(t==null)return{};var n={},r=Object.keys(t),a,i;for(i=0;i<r.length;i++)a=r[i],!(s.indexOf(a)>=0)&&(n[a]=t[a]);return n}function et(t,s){if(t==null)return{};var n=Qe(t,s),r,a;if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(t);for(a=0;a<i.length;a++)r=i[a],!(s.indexOf(r)>=0)&&Object.prototype.propertyIsEnumerable.call(t,r)&&(n[r]=t[r])}return n}function tt(t,s){return nt(t)||st(t,s)||rt(t,s)||at()}function nt(t){if(Array.isArray(t))return t}function st(t,s){if(!(typeof Symbol>"u"||!(Symbol.iterator in Object(t)))){var n=[],r=!0,a=!1,i=void 0;try{for(var o=t[Symbol.iterator](),l;!(r=(l=o.next()).done)&&(n.push(l.value),!(s&&n.length===s));r=!0);}catch(c){a=!0,i=c}finally{try{!r&&o.return!=null&&o.return()}finally{if(a)throw i}}return n}}function rt(t,s){if(t){if(typeof t=="string")return ve(t,s);var n=Object.prototype.toString.call(t).slice(8,-1);if(n==="Object"&&t.constructor&&(n=t.constructor.name),n==="Map"||n==="Set")return Array.from(t);if(n==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return ve(t,s)}}function ve(t,s){(s==null||s>t.length)&&(s=t.length);for(var n=0,r=new Array(s);n<s;n++)r[n]=t[n];return r}function at(){throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function it(t,s,n){return s in t?Object.defineProperty(t,s,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[s]=n,t}function je(t,s){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);s&&(r=r.filter(function(a){return Object.getOwnPropertyDescriptor(t,a).enumerable})),n.push.apply(n,r)}return n}function Ce(t){for(var s=1;s<arguments.length;s++){var n=arguments[s]!=null?arguments[s]:{};s%2?je(Object(n),!0).forEach(function(r){it(t,r,n[r])}):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):je(Object(n)).forEach(function(r){Object.defineProperty(t,r,Object.getOwnPropertyDescriptor(n,r))})}return t}function ot(){for(var t=arguments.length,s=new Array(t),n=0;n<t;n++)s[n]=arguments[n];return function(r){return s.reduceRight(function(a,i){return i(a)},r)}}function H(t){return function s(){for(var n=this,r=arguments.length,a=new Array(r),i=0;i<r;i++)a[i]=arguments[i];return a.length>=t.length?t.apply(this,a):function(){for(var o=arguments.length,l=new Array(o),c=0;c<o;c++)l[c]=arguments[c];return s.apply(n,[].concat(a,l))}}}function te(t){return{}.toString.call(t).includes("Object")}function lt(t){return!Object.keys(t).length}function q(t){return typeof t=="function"}function ct(t,s){return Object.prototype.hasOwnProperty.call(t,s)}function dt(t,s){return te(s)||I("changeType"),Object.keys(s).some(function(n){return!ct(t,n)})&&I("changeField"),s}function mt(t){q(t)||I("selectorType")}function ut(t){q(t)||te(t)||I("handlerType"),te(t)&&Object.values(t).some(function(s){return!q(s)})&&I("handlersType")}function pt(t){t||I("initialIsRequired"),te(t)||I("initialType"),lt(t)&&I("initialContent")}function ht(t,s){throw new Error(t[s]||t.default)}var gt={initialIsRequired:"initial state is required",initialType:"initial state should be an object",initialContent:"initial state shouldn't be an empty object",handlerType:"handler should be an object or a function",handlersType:"all handlers should be a functions",selectorType:"selector should be a function",changeType:"provided value of changes should be an object",changeField:'it seams you want to change a field in the state which is not specified in the "initial" state',default:"an unknown error accured in `state-local` package"},I=H(ht)(gt),X={changes:dt,selector:mt,handler:ut,initial:pt};function xt(t){var s=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};X.initial(t),X.handler(s);var n={current:t},r=H(yt)(n,s),a=H(bt)(n),i=H(X.changes)(t),o=H(ft)(n);function l(){var d=arguments.length>0&&arguments[0]!==void 0?arguments[0]:function(m){return m};return X.selector(d),d(n.current)}function c(d){ot(r,a,i,o)(d)}return[l,c]}function ft(t,s){return q(s)?s(t.current):s}function bt(t,s){return t.current=Ce(Ce({},t.current),s),s}function yt(t,s,n){return q(s)?s(t.current):Object.keys(n).forEach(function(r){var a;return(a=s[r])===null||a===void 0?void 0:a.call(s,t.current[r])}),n}var vt={create:xt},jt={paths:{vs:"https://cdn.jsdelivr.net/npm/monaco-editor@0.52.2/min/vs"}};function Ct(t){return function s(){for(var n=this,r=arguments.length,a=new Array(r),i=0;i<r;i++)a[i]=arguments[i];return a.length>=t.length?t.apply(this,a):function(){for(var o=arguments.length,l=new Array(o),c=0;c<o;c++)l[c]=arguments[c];return s.apply(n,[].concat(a,l))}}}function Nt(t){return{}.toString.call(t).includes("Object")}function wt(t){return t||Ne("configIsRequired"),Nt(t)||Ne("configType"),t.urls?(St(),{paths:{vs:t.urls.monacoBase}}):t}function St(){console.warn(De.deprecation)}function kt(t,s){throw new Error(t[s]||t.default)}var De={configIsRequired:"the configuration object is required",configType:"the configuration object should be an object",default:"an unknown error accured in `@monaco-editor/loader` package",deprecation:`Deprecation warning!
    You are using deprecated way of configuration.

    Instead of using
      monaco.config({ urls: { monacoBase: '...' } })
    use
      monaco.config({ paths: { vs: '...' } })

    For more please check the link https://github.com/suren-atoyan/monaco-loader#config
  `},Ne=Ct(kt)(De),Tt={config:wt},Dt=function(){for(var s=arguments.length,n=new Array(s),r=0;r<s;r++)n[r]=arguments[r];return function(a){return n.reduceRight(function(i,o){return o(i)},a)}};function Re(t,s){return Object.keys(s).forEach(function(n){s[n]instanceof Object&&t[n]&&Object.assign(s[n],Re(t[n],s[n]))}),ye(ye({},t),s)}var Rt={type:"cancelation",msg:"operation is manually canceled"};function ce(t){var s=!1,n=new Promise(function(r,a){t.then(function(i){return s?a(Rt):r(i)}),t.catch(a)});return n.cancel=function(){return s=!0},n}var Et=vt.create({config:jt,isInitialized:!1,resolve:null,reject:null,monaco:null}),Ee=tt(Et,2),Y=Ee[0],re=Ee[1];function Mt(t){var s=Tt.config(t),n=s.monaco,r=et(s,["monaco"]);re(function(a){return{config:Re(a.config,r),monaco:n}})}function At(){var t=Y(function(s){var n=s.monaco,r=s.isInitialized,a=s.resolve;return{monaco:n,isInitialized:r,resolve:a}});if(!t.isInitialized){if(re({isInitialized:!0}),t.monaco)return t.resolve(t.monaco),ce(de);if(window.monaco&&window.monaco.editor)return Me(window.monaco),t.resolve(window.monaco),ce(de);Dt(Ot,Lt)(Pt)}return ce(de)}function Ot(t){return document.body.appendChild(t)}function zt(t){var s=document.createElement("script");return t&&(s.src=t),s}function Lt(t){var s=Y(function(r){var a=r.config,i=r.reject;return{config:a,reject:i}}),n=zt("".concat(s.config.paths.vs,"/loader.js"));return n.onload=function(){return t()},n.onerror=s.reject,n}function Pt(){var t=Y(function(n){var r=n.config,a=n.resolve,i=n.reject;return{config:r,resolve:a,reject:i}}),s=window.require;s.config(t.config),s(["vs/editor/editor.main"],function(n){Me(n),t.resolve(n)},function(n){t.reject(n)})}function Me(t){Y().monaco||re({monaco:t})}function _t(){return Y(function(t){var s=t.monaco;return s})}var de=new Promise(function(t,s){return re({resolve:t,reject:s})}),Ae={config:Mt,init:At,__getMonacoInstance:_t},Ft={wrapper:{display:"flex",position:"relative",textAlign:"initial"},fullWidth:{width:"100%"},hide:{display:"none"}},me=Ft,It={container:{display:"flex",height:"100%",width:"100%",justifyContent:"center",alignItems:"center"}},Bt=It;function $t({children:t}){return G.createElement("div",{style:Bt.container},t)}var Gt=$t,Ut=Gt;function Vt({width:t,height:s,isEditorReady:n,loading:r,_ref:a,className:i,wrapperProps:o}){return G.createElement("section",{style:{...me.wrapper,width:t,height:s},...o},!n&&G.createElement(Ut,null,r),G.createElement("div",{ref:a,style:{...me.fullWidth,...!n&&me.hide},className:i}))}var Zt=Vt,Oe=y.memo(Zt);function Ht(t){y.useEffect(t,[])}var ze=Ht;function Wt(t,s,n=!0){let r=y.useRef(!0);y.useEffect(r.current||!n?()=>{r.current=!1}:t,s)}var P=Wt;function W(){}function V(t,s,n,r){return qt(t,r)||Yt(t,s,n,r)}function qt(t,s){return t.editor.getModel(Le(t,s))}function Yt(t,s,n,r){return t.editor.createModel(s,n,r?Le(t,r):void 0)}function Le(t,s){return t.Uri.parse(s)}function Kt({original:t,modified:s,language:n,originalLanguage:r,modifiedLanguage:a,originalModelPath:i,modifiedModelPath:o,keepCurrentOriginalModel:l=!1,keepCurrentModifiedModel:c=!1,theme:d="light",loading:m="Loading...",options:g={},height:h="100%",width:C="100%",className:j,wrapperProps:N={},beforeMount:u=W,onMount:b=W}){let[x,p]=y.useState(!1),[w,v]=y.useState(!0),S=y.useRef(null),k=y.useRef(null),T=y.useRef(null),R=y.useRef(b),f=y.useRef(u),D=y.useRef(!1);ze(()=>{let E=Ae.init();return E.then(A=>(k.current=A)&&v(!1)).catch(A=>A?.type!=="cancelation"&&console.error("Monaco initialization: error:",A)),()=>S.current?B():E.cancel()}),P(()=>{if(S.current&&k.current){let E=S.current.getOriginalEditor(),A=V(k.current,t||"",r||n||"text",i||"");A!==E.getModel()&&E.setModel(A)}},[i],x),P(()=>{if(S.current&&k.current){let E=S.current.getModifiedEditor(),A=V(k.current,s||"",a||n||"text",o||"");A!==E.getModel()&&E.setModel(A)}},[o],x),P(()=>{let E=S.current.getModifiedEditor();E.getOption(k.current.editor.EditorOption.readOnly)?E.setValue(s||""):s!==E.getValue()&&(E.executeEdits("",[{range:E.getModel().getFullModelRange(),text:s||"",forceMoveMarkers:!0}]),E.pushUndoStop())},[s],x),P(()=>{S.current?.getModel()?.original.setValue(t||"")},[t],x),P(()=>{let{original:E,modified:A}=S.current.getModel();k.current.editor.setModelLanguage(E,r||n||"text"),k.current.editor.setModelLanguage(A,a||n||"text")},[n,r,a],x),P(()=>{k.current?.editor.setTheme(d)},[d],x),P(()=>{S.current?.updateOptions(g)},[g],x);let L=y.useCallback(()=>{if(!k.current)return;f.current(k.current);let E=V(k.current,t||"",r||n||"text",i||""),A=V(k.current,s||"",a||n||"text",o||"");S.current?.setModel({original:E,modified:A})},[n,s,a,t,r,i,o]),_=y.useCallback(()=>{!D.current&&T.current&&(S.current=k.current.editor.createDiffEditor(T.current,{automaticLayout:!0,...g}),L(),k.current?.editor.setTheme(d),p(!0),D.current=!0)},[g,d,L]);y.useEffect(()=>{x&&R.current(S.current,k.current)},[x]),y.useEffect(()=>{!w&&!x&&_()},[w,x,_]);function B(){let E=S.current?.getModel();l||E?.original?.dispose(),c||E?.modified?.dispose(),S.current?.dispose()}return G.createElement(Oe,{width:C,height:h,isEditorReady:x,loading:m,_ref:T,className:j,wrapperProps:N})}var Jt=Kt;y.memo(Jt);function Xt(t){let s=y.useRef();return y.useEffect(()=>{s.current=t},[t]),s.current}var Qt=Xt,Q=new Map;function en({defaultValue:t,defaultLanguage:s,defaultPath:n,value:r,language:a,path:i,theme:o="light",line:l,loading:c="Loading...",options:d={},overrideServices:m={},saveViewState:g=!0,keepCurrentModel:h=!1,width:C="100%",height:j="100%",className:N,wrapperProps:u={},beforeMount:b=W,onMount:x=W,onChange:p,onValidate:w=W}){let[v,S]=y.useState(!1),[k,T]=y.useState(!0),R=y.useRef(null),f=y.useRef(null),D=y.useRef(null),L=y.useRef(x),_=y.useRef(b),B=y.useRef(),E=y.useRef(r),A=Qt(i),he=y.useRef(!1),ae=y.useRef(!1);ze(()=>{let O=Ae.init();return O.then(F=>(R.current=F)&&T(!1)).catch(F=>F?.type!=="cancelation"&&console.error("Monaco initialization: error:",F)),()=>f.current?Be():O.cancel()}),P(()=>{let O=V(R.current,t||r||"",s||a||"",i||n||"");O!==f.current?.getModel()&&(g&&Q.set(A,f.current?.saveViewState()),f.current?.setModel(O),g&&f.current?.restoreViewState(Q.get(i)))},[i],v),P(()=>{f.current?.updateOptions(d)},[d],v),P(()=>{!f.current||r===void 0||(f.current.getOption(R.current.editor.EditorOption.readOnly)?f.current.setValue(r):r!==f.current.getValue()&&(ae.current=!0,f.current.executeEdits("",[{range:f.current.getModel().getFullModelRange(),text:r,forceMoveMarkers:!0}]),f.current.pushUndoStop(),ae.current=!1))},[r],v),P(()=>{let O=f.current?.getModel();O&&a&&R.current?.editor.setModelLanguage(O,a)},[a],v),P(()=>{l!==void 0&&f.current?.revealLine(l)},[l],v),P(()=>{R.current?.editor.setTheme(o)},[o],v);let ge=y.useCallback(()=>{if(!(!D.current||!R.current)&&!he.current){_.current(R.current);let O=i||n,F=V(R.current,r||t||"",s||a||"",O||"");f.current=R.current?.editor.create(D.current,{model:F,automaticLayout:!0,...d},m),g&&f.current.restoreViewState(Q.get(O)),R.current.editor.setTheme(o),l!==void 0&&f.current.revealLine(l),S(!0),he.current=!0}},[t,s,n,r,a,i,d,m,g,o,l]);y.useEffect(()=>{v&&L.current(f.current,R.current)},[v]),y.useEffect(()=>{!k&&!v&&ge()},[k,v,ge]),E.current=r,y.useEffect(()=>{v&&p&&(B.current?.dispose(),B.current=f.current?.onDidChangeModelContent(O=>{ae.current||p(f.current.getValue(),O)}))},[v,p]),y.useEffect(()=>{if(v){let O=R.current.editor.onDidChangeMarkers(F=>{let ie=f.current.getModel()?.uri;if(ie&&F.find(oe=>oe.path===ie.path)){let oe=R.current.editor.getModelMarkers({resource:ie});w?.(oe)}});return()=>{O?.dispose()}}return()=>{}},[v,w]);function Be(){B.current?.dispose(),h?g&&Q.set(i,f.current.saveViewState()):f.current.getModel()?.dispose(),f.current.dispose()}return G.createElement(Oe,{width:C,height:j,isEditorReady:v,loading:c,_ref:D,className:N,wrapperProps:u})}var tn=en,Pe=y.memo(tn);const nn=`import { Card, CellData, CellType, RoadSegment } from "./game";
import { ScoringCondition } from "./scoring";
import { CustomScoringCondition } from "./scoring-formulas";
import { CustomMetadata, MetadataSchema } from "./metadataSystem";

export interface ZoneType {
  id: string;
  name: string;
  color: string;
  description?: string;
  defaultMetadata?: CustomMetadata; // Default metadata values for cells of this zone type
}

export interface CardDefinition {
  id: string;
  name?: string;
  cells: CellData[][];
  count: number; // How many of this card are in the deck
  scoringConditionId?: string; // References a scoring condition in the deck
  // customMetadata removed - metadata now lives at the cell/zone level
}

export interface Expansion {
  id: string;
  name: string;
  description: string;
  cards: CardDefinition[];
}

export interface GameVariation {
  id: string;
  name: string;
  description: string;
  baseCards: CardDefinition[];
  expansions: Expansion[];
  zoneTypes: ZoneType[];
  theme: {
    primaryColor: string;
    secondaryColor: string;
  };
  type?: "preset" | "custom";
  isCustom?: boolean;
  metadataSchema?: MetadataSchema; // Schema for custom card metadata
}

export interface CustomDeck extends GameVariation {
  type: "custom";
  isCustom: true;
  customScoringConditions: CustomScoringCondition[]; // All custom scoring conditions in this deck
  metadata: {
    author: string;
    created: Date;
    modified: Date;
    version: string;
  };
}

// Helper function to create cell data
const cell = (type: CellType, roads: RoadSegment[] = []): CellData => ({
  type,
  roads,
});

// Common road patterns
const ROADS = {
  NONE: [] as RoadSegment[],
  HORIZONTAL: [[3, 1] as RoadSegment], // Left to right
  VERTICAL: [[0, 2] as RoadSegment], // Top to bottom
  L_TOP_RIGHT: [[0, 1] as RoadSegment], // Top to right
  L_RIGHT_BOTTOM: [[1, 2] as RoadSegment], // Right to bottom
  L_BOTTOM_LEFT: [[2, 3] as RoadSegment], // Bottom to left
  L_LEFT_TOP: [[3, 0] as RoadSegment], // Left to top
  T_JUNCTION: [[0, 1], [1, 2] as RoadSegment], // Multiple segments for T-junctions
};

// Sprawopolis (Urban sprawl theme)
export const SPRAWOPOLIS: GameVariation = {
  id: "sprawopolis",
  name: "Sprawopolis",
  description: "The original urban planning card game",
  type: "preset",
  isCustom: false,
  zoneTypes: [
    {
      id: "residential",
      name: "Residential",
      color: "#60a5fa",
      description: "Housing areas",
    },
    {
      id: "commercial",
      name: "Commercial",
      color: "#f59e0b",
      description: "Business districts",
    },
    {
      id: "industrial",
      name: "Industrial",
      color: "#6b7280",
      description: "Manufacturing zones",
    },
    { id: "park", name: "Park", color: "#34d399", description: "Green spaces" },
  ],
  theme: {
    primaryColor: "#3b82f6",
    secondaryColor: "#1e40af",
  },
  baseCards: [
    // Residential-heavy cards
    {
      id: "spr-001",
      name: "Residential Block",
      count: 3,
      cells: [
        [cell("residential"), cell("residential")],
        [cell("residential"), cell("park")],
      ],
      scoringConditionId: "spr-001-residential-block",
    },
    {
      id: "spr-002",
      name: "Suburb",
      count: 2,
      cells: [
        [
          cell("residential", ROADS.HORIZONTAL),
          cell("residential", ROADS.HORIZONTAL),
        ],
        [cell("park"), cell("residential")],
      ],
      scoringConditionId: "spr-002-suburb",
    },
    // Commercial districts
    {
      id: "spr-003",
      name: "Shopping District",
      count: 2,
      cells: [
        [cell("commercial"), cell("commercial")],
        [cell("commercial"), cell("residential")],
      ],
      scoringConditionId: "spr-003-shopping-district",
    },
    {
      id: "spr-004",
      name: "Main Street",
      count: 3,
      cells: [
        [cell("commercial", ROADS.VERTICAL), cell("park")],
        [cell("commercial", ROADS.VERTICAL), cell("commercial")],
      ],
      scoringConditionId: "spr-004-main-street",
    },
    // Industrial areas
    {
      id: "spr-005",
      name: "Factory District",
      count: 2,
      cells: [
        [cell("industrial"), cell("industrial")],
        [cell("industrial"), cell("park")],
      ],
      scoringConditionId: "spr-005-factory-district",
    },
    {
      id: "spr-006",
      name: "Warehouse",
      count: 2,
      cells: [
        [cell("industrial", ROADS.L_TOP_RIGHT), cell("commercial")],
        [cell("park"), cell("industrial")],
      ],
      scoringConditionId: "spr-006-warehouse",
    },
    // Mixed development
    {
      id: "spr-007",
      name: "Mixed Use",
      count: 4,
      cells: [
        [cell("commercial"), cell("residential")],
        [cell("park"), cell("industrial")],
      ],
      scoringConditionId: "spr-007-mixed-use",
    },
    // Road-heavy cards
    {
      id: "spr-008",
      name: "Intersection",
      count: 3,
      cells: [
        [cell("park", ROADS.L_LEFT_TOP), cell("commercial", ROADS.L_TOP_RIGHT)],
        [
          cell("residential", ROADS.L_BOTTOM_LEFT),
          cell("industrial", ROADS.L_RIGHT_BOTTOM),
        ],
      ],
      scoringConditionId: "spr-008-intersection",
    },
  ],
  expansions: [
    {
      id: "spr-exp-1",
      name: "Sprawopolis: Beaches",
      description: "Adds coastal development cards",
      cards: [
        {
          id: "spr-beach-001",
          name: "Beachfront",
          count: 2,
          cells: [
            [cell("park"), cell("park")],
            [cell("residential"), cell("commercial")],
          ],
          scoringConditionId: "spr-beach-001-beachfront",
        },
        {
          id: "spr-beach-002",
          name: "Pier",
          count: 1,
          cells: [
            [
              cell("commercial", ROADS.HORIZONTAL),
              cell("commercial", ROADS.HORIZONTAL),
            ],
            [cell("park"), cell("park")],
          ],
          scoringConditionId: "spr-beach-002-pier",
        },
      ],
    },
  ],
};

// Agropolis (Rural/farming theme)
const AGROPOLIS: GameVariation = {
  id: "agropolis",
  name: "Agropolis",
  description: "Rural farming and countryside development",
  type: "preset",
  isCustom: false,
  zoneTypes: [
    {
      id: "fields",
      name: "Fields",
      color: "#84cc16",
      description: "Farmland and crops",
    },
    {
      id: "livestock",
      name: "Livestock",
      color: "#a78bfa",
      description: "Animal farming",
    },
    {
      id: "orchards",
      name: "Orchards",
      color: "#34d399",
      description: "Fruit trees",
    },
    {
      id: "buildings",
      name: "Buildings",
      color: "#f59e0b",
      description: "Farm buildings",
    },
  ],
  theme: {
    primaryColor: "#22c55e",
    secondaryColor: "#15803d",
  },
  baseCards: [
    {
      id: "agr-001",
      name: "Farmland",
      count: 4,
      cells: [
        [cell("park"), cell("park")],
        [cell("park"), cell("residential")],
      ],
      scoringConditionId: "agr-001-farmland",
    },
    {
      id: "agr-002",
      name: "Barn Complex",
      count: 3,
      cells: [
        [cell("industrial"), cell("park")],
        [cell("park"), cell("park")],
      ],
      scoringConditionId: "agr-002-barn-complex",
    },
    {
      id: "agr-003",
      name: "Country Store",
      count: 2,
      cells: [
        [cell("commercial", ROADS.L_TOP_RIGHT), cell("residential")],
        [cell("park"), cell("park")],
      ],
      scoringConditionId: "agr-003-country-store",
    },
    {
      id: "agr-004",
      name: "Rural Road",
      count: 4,
      cells: [
        [cell("park", ROADS.HORIZONTAL), cell("park", ROADS.HORIZONTAL)],
        [cell("residential"), cell("park")],
      ],
      scoringConditionId: "agr-004-rural-road",
    },
  ],
  expansions: [],
};

// Casinopolis (Casino/entertainment theme)
const CASINOPOLIS: GameVariation = {
  id: "casinopolis",
  name: "Casinopolis",
  description: "Glitzy casino and entertainment district",
  type: "preset",
  isCustom: false,
  zoneTypes: [
    {
      id: "casino",
      name: "Casino",
      color: "#dc2626",
      description: "Gaming floors",
    },
    {
      id: "hotel",
      name: "Hotel",
      color: "#7c3aed",
      description: "Accommodation",
    },
    {
      id: "entertainment",
      name: "Entertainment",
      color: "#06b6d4",
      description: "Shows and venues",
    },
    {
      id: "dining",
      name: "Dining",
      color: "#f59e0b",
      description: "Restaurants and bars",
    },
  ],
  theme: {
    primaryColor: "#f59e0b",
    secondaryColor: "#d97706",
  },
  baseCards: [
    {
      id: "cas-001",
      name: "Casino Floor",
      count: 3,
      cells: [
        [cell("commercial"), cell("commercial")],
        [cell("commercial"), cell("commercial")],
      ],
    },
    {
      id: "cas-002",
      name: "Hotel Tower",
      count: 2,
      cells: [
        [cell("residential"), cell("residential")],
        [cell("commercial"), cell("park")],
      ],
    },
    {
      id: "cas-003",
      name: "Entertainment District",
      count: 3,
      cells: [
        [cell("commercial", ROADS.VERTICAL), cell("park")],
        [cell("commercial", ROADS.VERTICAL), cell("residential")],
      ],
    },
    {
      id: "cas-004",
      name: "Service Area",
      count: 2,
      cells: [
        [cell("industrial"), cell("commercial")],
        [cell("park"), cell("residential")],
      ],
    },
  ],
  expansions: [],
};

export const GAME_VARIATIONS: GameVariation[] = [
  SPRAWOPOLIS,
  AGROPOLIS,
  CASINOPOLIS,
];
`,sn=`import { CustomDeck } from './deck';

/**
 * Analytics and balance information for a custom deck
 */
export interface DeckBalance {
  cardCount: number;
  zoneDistribution: Record<string, number>;
  roadComplexity: {
    simple: number;
    medium: number;
    complex: number;
  };
  scoringPotential: {
    min: number;
    max: number;
    average: number;
  };
  recommendedPlayerCount: number[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  balanceScore: number; // 0-10 rating
}

/**
 * Suggestions for improving deck balance
 */
export interface DeckSuggestion {
  id: string;
  type: 'warning' | 'suggestion' | 'improvement';
  category: 'balance' | 'scoring' | 'complexity' | 'theme';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  actionable: boolean;
}

/**
 * Analysis result for a deck
 */
export interface DeckAnalysisResult {
  deck: CustomDeck;
  balance: DeckBalance;
  suggestions: DeckSuggestion[];
  analysisDate: Date;
  version: string;
}

/**
 * Configuration for deck analysis
 */
export interface AnalysisConfig {
  includeScoring: boolean;
  includeBalance: boolean;
  includeComplexity: boolean;
  targetPlayerCount?: number;
  difficultyTarget?: 'beginner' | 'intermediate' | 'advanced';
}`,rn=`import { CustomMetadata } from "./metadataSystem";

// Road segments connect edges: top, right, bottom, left (0, 1, 2, 3)
export type RoadSegment = [number, number]; // [from_edge, to_edge]

export type TileData = CellData & {
  cardId: string;
  x: number;
  y: number;
  cardIndex: number; // Track which card this is from (later cards are on top)
};

export interface CellData {
  type: CellType;
  roads: RoadSegment[]; // Road segments in this cell
  customMetadata?: CustomMetadata; // Custom metadata for this individual cell
}

export interface Card {
  id: string;
  x: number;
  y: number;
  cells: CellData[][];
  rotation: number; // 0 or 180 degrees
}

export type CellType = string;

export interface Player {
  id: string;
  name: string;
  hand: Card[];
  isActive: boolean;
}

export interface GameState {
  players: Player[];
  currentPlayerIndex: number;
  deck: Card[];
  board: Card[];
  topCard: Card | null; // Public visible top card of deck
  gamePhase: "setup" | "playing" | "ended";
  turnCount: number;
  scoring?: {
    activeConditions: Array<{ id: string; name: string; description: string }>;
    targetScore: number;
    customConditions?: any[]; // Store custom scoring conditions
  };
}

export interface Transform {
  scale: number;
  offsetX: number;
  offsetY: number;
}
`,_e=`// Monaco Editor TypeScript definitions for metadata rendering formulas
// This file is imported as raw text to provide IntelliSense in the editor

import type { GameState, CellData } from "./game";
import type { CustomMetadata, CustomMetadataField } from "./metadataSystem";

// Main metadata rendering context interface available to custom formulas
export declare interface MetadataRenderContext {
  // Canvas element for rendering (60x40 pixels, 3:2 aspect ratio to match tiles)
  canvas: HTMLCanvasElement;
  
  // Canvas 2D rendering context
  ctx: CanvasRenderingContext2D;
  
  // Metadata and field information
  metadata: CustomMetadata;
  field: CustomMetadataField;
  
  // Zone information
  zone: CellData;
  zonePosition: { row: number; col: number };
  
  // Actual zone dimensions (for reference)
  cellWidth: number;
  cellHeight: number;
  
  // Optional game state
  gameState?: GameState;
}

// Expected function signature for metadata rendering formulas
declare function renderMetadata(context: MetadataRenderContext): void;

// Canvas 2D API interfaces for better IntelliSense
declare interface CanvasRenderingContext2D {
  // Drawing methods
  fillText(text: string, x: number, y: number): void;
  strokeText(text: string, x: number, y: number): void;
  fillRect(x: number, y: number, width: number, height: number): void;
  strokeRect(x: number, y: number, width: number, height: number): void;
  arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, anticlockwise?: boolean): void;
  
  // Path methods
  beginPath(): void;
  closePath(): void;
  moveTo(x: number, y: number): void;
  lineTo(x: number, y: number): void;
  fill(): void;
  stroke(): void;
  
  // State methods
  save(): void;
  restore(): void;
  
  // Style properties
  fillStyle: string | CanvasGradient | CanvasPattern;
  strokeStyle: string | CanvasGradient | CanvasPattern;
  font: string;
  lineWidth: number;
  textAlign: CanvasTextAlign;
  textBaseline: CanvasTextBaseline;
}

// Text alignment options
type CanvasTextAlign = "start" | "end" | "left" | "right" | "center";
type CanvasTextBaseline = "top" | "hanging" | "middle" | "alphabetic" | "ideographic" | "bottom";

// Common zone types (for IntelliSense suggestions)
type ZoneType = 
  | "residential"
  | "commercial" 
  | "industrial"
  | "road"
  | "park"
  | "water";`,an=`/**
 * Base types for the custom metadata system
 * These types define the foundation for card-level custom properties
 */

export interface CustomMetadataField {
  id: string;
  name: string;
  type: 'number' | 'text' | 'boolean' | 'select';
  description?: string;
  defaultValue?: any;
  options?: string[]; // For select type
  min?: number; // For number type
  max?: number; // For number type
  required?: boolean;
  // Rendering configuration
  renderOnCard?: boolean; // Whether to render this field on cards
  renderFormula?: string; // TypeScript code for rendering
  compiledRenderFormula?: string; // Compiled JavaScript for rendering
}

export interface CustomMetadata {
  [fieldId: string]: number | string | boolean;
}

export interface ValidationError {
  fieldId: string;
  message: string;
}

export interface MetadataSchema {
  fields: CustomMetadataField[];
  version: string;
}`,on=`import { Card } from './game';
import { CustomScoringCondition } from './scoring-formulas';
import { CustomDeck } from './deck';

/**
 * Represents a highlighted tile on the board for visual feedback
 */
export interface TileHighlight {
  row: number;
  col: number;
  color: string;
  intensity: number; // 0-1, where 1 is most highlighted
  description?: string;
}

/**
 * Results from testing a scoring rule
 */
export interface RuleTestResults {
  ruleId: string;
  testBoard: Card[];
  calculatedScore: number;
  highlightedTiles: TileHighlight[];
  executionTime: number;
  errors: string[];
  details?: {
    description: string;
    breakdown: Array<{
      description: string;
      points: number;
      tiles: Array<{ row: number; col: number }>;
    }>;
  };
}

/**
 * Configuration for the rule testing environment
 */
export interface RuleTestEnvironment {
  currentRule: CustomScoringCondition | null;
  testBoard: Card[];
  availableCards: Card[];
  scoringResults: RuleTestResults | null;
  highlightedTiles: TileHighlight[];
  boardSize: number;
  isLoading: boolean;
}

/**
 * Preset board configurations for testing
 */
export interface BoardPreset {
  id: string;
  name: string;
  description: string;
  board: Card[];
  suggestedRules: string[]; // Rule IDs that work well with this preset
}

/**
 * Test scenario with expected results
 */
export interface TestScenario {
  id: string;
  name: string;
  description: string;
  board: Card[];
  ruleId: string;
  expectedScore: number;
  expectedHighlights?: Array<{ row: number; col: number }>;
}

/**
 * Board position for placing cards
 */
export interface BoardPosition {
  x: number;
  y: number;
}`,ln=`// Monaco Editor TypeScript definitions for scoring formulas
// This file is imported as raw text to provide IntelliSense in the editor

import type { GameState, TileData } from "./game";
import type { ScoringDetail, Cluster, RoadNetwork } from "./scoring";

// Main scoring context interface available to custom formulas
export declare interface ScoringContext {
  // Current game state
  gameState: GameState;
  roads: Array<RoadNetwork>;
  tileMap: { [y: number]: { [x: number]: TileData | null } };
  tiles: Array<TileData>;

  // Board utilities
  getAllTiles(): Array<TileData>;
  getTileAt(row: number, col: number): TileData | null;
  getAdjacentTiles(row: number, col: number): Array<TileData>;

  // Zone analysis
  findClusters<T extends string>(
    ...zoneTypes: T[]
  ): {
    [K in T]: Array<Cluster>;
  };
  findLargestCluster(zoneType: string): Cluster;
  countZonesOfType(zoneType: string): number;

  // Road utilities
  findRoadNetworks(): Array<RoadNetwork>;

  // Geometric utilities
  getDistance(tile1: TileData, tile2: TileData): number;
  isAdjacent(tile1: TileData, tile2: TileData): boolean;
  getTilesInRadius(
    center: { x: number; y: number },
    radius: number
  ): Array<TileData>;

  // Scoring helpers
  sum(numbers: number[]): number;
  max(numbers: number[]): number;
  min(numbers: number[]): number;
  count<T>(items: T[], predicate: (item: T) => boolean): number;
}

// Expected function signature for scoring formulas
declare function calculateScore(context: ScoringContext): number;

// Optional function for detailed scoring with tile highlights
declare function calculateScoreWithDetails(context: ScoringContext): {
  score: number;
  details?: ScoringDetail[];
  highlightedTiles?: Array<{ row: number; col: number }>;
};

// Common zone types (for IntelliSense suggestions)
type ZoneType =
  | "residential"
  | "commercial"
  | "industrial"
  | "road"
  | "park"
  | "water";
`,cn=`import { GameState } from "./game";
import type { ScoringCondition, ScoringDetail } from "./scoring";

// TypeScript compilation result
export interface CompilationResult {
  source: string;
  compiled: string;
  sourceMap?: string;
  success: boolean;
  error?: string;
  diagnostics?: string[];
}

// Sandboxed execution result
export interface ScoringResult {
  score: number;
  details?: ScoringDetail[];
  executionTime: number;
  error?: string;
  highlightedTiles?: Array<{ row: number; col: number }>;
}

// Test case for formula validation
export interface TestCase {
  id: string;
  name: string;
  boardState: GameState;
  expectedScore?: number;
  description?: string;
}


// Editor state
export interface FormulaEditorState {
  formula: string;
  compilationResult?: CompilationResult;
  testResults: Map<string, ScoringResult>;
  isCompiling: boolean;
  isTesting: boolean;
  selectedTestCase?: string;
}

// Custom scoring condition with TypeScript formula
export interface CustomScoringCondition extends ScoringCondition {
  isCustom: true;
  isGlobal?: boolean; // If true, applies to all games with this deck, not tied to specific cards
  formula: string;
  compiledFormula: string;
  testCases: TestCase[];
  createdAt: Date;
  updatedAt: Date;
}

// Formula template for quick start
export interface FormulaTemplate {
  id: string;
  name: string;
  description: string;
  category: "adjacency" | "cluster" | "road" | "diversity" | "geometric";
  code: string;
  explanation: string;
}
`,dn=`import { Card, CellType, TileData } from "./game";

// Information about tiles relevant to a scoring condition
export interface ScoringDetail {
  points: number;
  relevantTiles: Array<{ x: number; y: number }>;
  description?: string;
}

export interface ConditionScore {
  condition: ScoringCondition;
  points: number;
  fromCache?: boolean;
  executionTime?: number;
  error?: string;
  details?: ScoringDetail;
}

// Scoring condition that can be applied to evaluate a board state
export interface ScoringCondition {
  id: string;
  name: string;
  description: string;
  // Function to evaluate this condition against the current board
  evaluate: (board: Card[]) => number;
  // Function to get detailed information about scoring (with relevant tiles)
  evaluateWithDetails?: (board: Card[]) => ScoringDetail;
  // Some conditions might contribute to target score
  targetContribution?: number;
}

// Result of scoring calculation
export interface ScoreResult {
  // Base scoring components
  clusterScores: Record<CellType, number>; // Points from largest cluster of each type
  roadPenalty: number; // Negative points from road networks
  baseScore: number; // Sum of cluster scores minus road penalty

  // Condition-based scoring
  conditionScores: {
    condition: ScoringCondition;
    points: number;
    details?: ScoringDetail;
  }[];
  conditionTotal: number;

  // Final totals
  totalScore: number;
  targetScore: number;

  // Details for visualization
  largestClusters?: Record<CellType, Cluster>; // Largest cluster of each type for visualization
  roadNetworks?: RoadNetwork[]; // All road networks for visualization
}

// Represents a connected cluster of cells of the same type
export interface Cluster {
  type: CellType;
  tiles: Array<TileData>;
  size: number;
}

// Represents a connected road network
export interface RoadNetwork {
  segments: Array<{
    cardId: string;
    cellRow: number;
    cellCol: number;
    x: number; // world coordinates
    y: number;
    segment: [number, number]; // [from_edge, to_edge]
  }>;
  size: number; // number of connected segments
}

// Extended card definition that can have scoring conditions
export interface ScoringCard extends Card {
  scoringCondition?: ScoringCondition;
}

// Game scoring state
export interface GameScoring {
  activeConditions: ScoringCondition[]; // The 3 active scoring conditions
  targetScore: number; // Calculated target score
  currentScore?: ScoreResult; // Current score (calculated on demand)
}
`,mn=Object.assign({"../types/deck.ts":nn,"../types/deckAnalytics.ts":sn,"../types/game.ts":rn,"../types/metadata-context.d.ts":_e,"../types/metadataSystem.ts":an,"../types/ruleTesting.ts":on,"../types/scoring-context.d.ts":ln,"../types/scoring-formulas.ts":cn,"../types/scoring.ts":dn});function un(){const t=[];return t.push("// Combined TypeScript definitions for Monaco Editor"),t.push("// Generated from multiple type files"),t.push(""),Object.entries(mn).forEach(([s,n])=>{const r=s.split("/").pop()?.replace(/\.(ts|d\.ts)$/,"")||"unknown";t.push(`// From ${r}`);let a=n;a=a.replace(/^import\s+.*?;?\s*$/gm,""),a=a.replace(/^export\s+/gm,"declare "),a=a.replace(/^interface\s/gm,"declare interface "),a=a.replace(/^type\s/gm,"declare type "),a=a.replace(/^function\s/gm,"declare function "),a=a.replace(/^declare\s+declare\s+/gm,"declare "),a=a.trim(),a&&(t.push(a),t.push(""))}),t.join(`
`)}class pn{generateTypesFromSchema(s){return!s.fields||s.fields.length===0?this.generateEmptyTypes():`
// Auto-generated metadata types for Monaco Editor
interface CustomZoneMetadata {${s.fields.map(r=>{const a=this.getTypeScriptType(r),i=r.required?"":"?";return`${r.description?`
  /** ${r.description} */`:""}
  ${r.id}${i}: ${a};`}).join(`
`)}
}

// Enhanced cell interface with typed metadata
interface CellWithMetadata extends CellData {
  customMetadata?: CustomZoneMetadata;
}

// Enhanced tile interface with typed zone metadata
interface TileWithMetadata extends Tile {
  customMetadata?: CustomZoneMetadata;
}

// Enhanced context with typed metadata access
interface TypedScoringContext extends ScoringContext {
  getAllTiles(): TileWithMetadata[];
  getTileAt(row: number, col: number): TileWithMetadata | null;
  getAdjacentTiles(row: number, col: number): TileWithMetadata[];
  getTilesInRadius(center: {row: number; col: number}, radius: number): TileWithMetadata[];
}

// Override the global ScoringContext type to include metadata support
declare const context: TypedScoringContext;
`}getTypeScriptType(s){switch(s.type){case"number":return"number";case"text":return"string";case"boolean":return"boolean";case"select":return s.options&&s.options.length>0?s.options.map(n=>`'${n}'`).join(" | "):"string";default:return"any"}}generateEmptyTypes(){return`
// No custom metadata defined
interface CustomZoneMetadata {}

// Enhanced cell interface with typed metadata
interface CellWithMetadata extends CellData {
  customMetadata?: CustomZoneMetadata;
}

// Enhanced tile interface with typed zone metadata
interface TileWithMetadata extends Tile {
  customMetadata?: CustomZoneMetadata;
}

// Enhanced context with typed metadata access
interface TypedScoringContext extends ScoringContext {
  getAllTiles(): TileWithMetadata[];
  getTileAt(row: number, col: number): TileWithMetadata | null;
  getAdjacentTiles(row: number, col: number): TileWithMetadata[];
  getTilesInRadius(center: {row: number; col: number}, radius: number): TileWithMetadata[];
}

// Override the global ScoringContext type to include metadata support
declare const context: TypedScoringContext;
`}updateMonacoTypes(s,n){try{const r=s.Uri.parse("file:///custom-metadata-types.d.ts"),a=s.editor.getModels();for(const i of a)if(i.uri.toString()===r.toString()){i.dispose();break}s.languages.typescript.typescriptDefaults.addExtraLib(n,r.toString())}catch(r){console.error("Failed to update Monaco types:",r)}}generateExampleUsage(s){if(!s.fields||s.fields.length===0)return`
// Example: Basic scoring without custom metadata
function calculateScore(context: ScoringContext): number {
  const tiles = context.getAllTiles();
  return tiles.length * 2;
}
`;const n=s.fields[0];return`
// Example: Scoring with custom zone metadata
function calculateScore(context: TypedScoringContext): number {
  let totalScore = 0;
  
  for (const tile of context.getAllTiles()) {
    const metadata = tile.customMetadata;
    if (metadata) {
      ${this.generateFieldUsageExample(n)}
    }
  }
  
  return totalScore;
}
`}generateFieldUsageExample(s){switch(s.type){case"number":return`// ${s.description||s.name}
      const ${s.id} = metadata.${s.id}; // TypeScript knows this is number
      totalScore += ${s.id} * 2;`;case"boolean":return`// ${s.description||s.name}
      if (metadata.${s.id}) {
        totalScore += 5; // Bonus when ${s.name} is true
      }`;case"select":const n=s.options?.[0]||"option1";return`// ${s.description||s.name}
      if (metadata.${s.id} === '${n}') {
        totalScore += 10; // Bonus for ${n}
      }`;case"text":return`// ${s.description||s.name}
      if (metadata.${s.id}.length > 0) {
        totalScore += 3; // Bonus for having ${s.name}
      }`;default:return`// Use ${s.name}
      totalScore += 1;`}}}function hn({value:t,onChange:s,onCompile:n,readonly:r=!1,height:a="400px",metadataSchema:i=null}){const o=y.useRef(null),[l,c]=y.useState(!1),d=y.useRef(new pn),m=y.useRef(null);y.useEffect(()=>{if(m.current&&l&&i){const j=d.current.generateTypesFromSchema(i);d.current.updateMonacoTypes(m.current,j)}},[i,l]);const g=(j,N)=>{if(o.current=j,m.current=N,N.languages.typescript.typescriptDefaults.addExtraLib(un(),"scoring-api.d.ts"),i){const b=d.current.generateTypesFromSchema(i);d.current.updateMonacoTypes(N,b)}N.languages.typescript.typescriptDefaults.setCompilerOptions({target:N.languages.typescript.ScriptTarget.ES2020,allowNonTsExtensions:!0,moduleResolution:N.languages.typescript.ModuleResolutionKind.NodeJs,module:N.languages.typescript.ModuleKind.CommonJS,noEmit:!0,strict:!0,noImplicitAny:!0,strictNullChecks:!0,strictFunctionTypes:!0,noImplicitReturns:!0,noUnusedLocals:!1,noUnusedParameters:!1,esModuleInterop:!0});const u=j.getModel();if(u&&n){const b=()=>{const x=N.editor.getModelMarkers({resource:u.uri});n(x)};N.editor.onDidChangeMarkers(()=>b()),setTimeout(b,500)}c(!0)},h=j=>{j!==void 0&&s(j)},C={readOnly:r,minimap:{enabled:!1},fontSize:14,lineNumbers:"on",roundedSelection:!1,scrollBeyondLastLine:!1,automaticLayout:!0,tabSize:2,insertSpaces:!0,wordWrap:"on",contextmenu:!0,folding:!0,suggest:{insertMode:"replace",snippetsPreventQuickSuggestions:!1}};return e.jsxs(e.Fragment,{children:[e.jsx(Pe,{height:a,defaultLanguage:"typescript",value:t,onChange:h,onMount:g,options:C,theme:"vs-dark"}),!l&&e.jsxs("div",{className:"flex items-center justify-center p-8",children:[e.jsx("span",{className:"loading loading-spinner loading-md"}),e.jsx("span",{className:"ml-2",children:"Loading TypeScript Editor..."})]})]})}const gn=[{id:"adjacency_bonus",name:"Adjacency Bonus",category:"adjacency",description:"Score bonus for zones adjacent to specific types",explanation:"Awards points for commercial zones next to residential zones",code:`// Adjacency Bonus Example
function calculateScore(context: ScoringContext): number {
  const { getAllTiles, getAdjacentTiles } = context;
  
  let bonus = 0;
  const tiles = getAllTiles();
  
  for (const tile of tiles) {
    if (tile.type === 'commercial') {
      const adjacent = getAdjacentTiles(tile.row, tile.col);
      const residentialNearby = adjacent.filter(t => t.type === 'residential').length;
      bonus += residentialNearby * 2; // 2 points per adjacent residential
    }
  }
  
  return bonus;
}`},{id:"cluster_bonus",name:"Cluster Scoring",category:"cluster",description:"Score based on connected zone clusters",explanation:"Awards bonus points for large connected clusters of the same type",code:`// Cluster Bonus Example  
function calculateScore(context: ScoringContext): number {
  const { findClusters } = context;
  
  let totalBonus = 0;
  const zoneTypes = ['residential', 'commercial', 'industrial', 'park'];
  
  for (const zoneType of zoneTypes) {
    const clusters = findClusters(zoneType);
    
    // Bonus for large clusters
    for (const cluster of clusters) {
      if (cluster.length >= 4) {
        totalBonus += cluster.length; // 1 point per tile in large clusters
      }
    }
  }
  
  return totalBonus;
}`},{id:"road_network",name:"Road Network",category:"road",description:"Score based on road connectivity",explanation:"Awards points for well-connected road networks",code:`// Road Network Bonus
function calculateScore(context: ScoringContext): number {
  const { findRoadNetworks } = context;
  
  const networks = findRoadNetworks();
  
  if (networks.length === 0) return 0;
  
  // Find the largest network
  const largestNetwork = max(networks.map(n => n.segments.length));
  
  // Bonus for having one large connected network
  return largestNetwork >= 6 ? 10 : largestNetwork;
}`},{id:"diversity_bonus",name:"Zone Diversity",category:"diversity",description:"Score for having diverse zone types",explanation:"Awards bonus points for cities with all zone types represented",code:`// Zone Diversity Bonus
function calculateScore(context: ScoringContext): number {
  const { countZonesOfType } = context;
  
  const zoneTypes = ['residential', 'commercial', 'industrial', 'park'];
  const zoneCounts = zoneTypes.map(type => countZonesOfType(type));
  
  // Count how many zone types are present
  const typesPresent = zoneCounts.filter(count => count > 0).length;
  
  // Bonus for diversity
  if (typesPresent === 4) return 15; // All types present
  if (typesPresent === 3) return 8;  // Three types
  if (typesPresent === 2) return 3;  // Two types
  
  return 0;
}`},{id:"balanced_development",name:"Balanced Development",category:"diversity",description:"Score for balanced zone distribution",explanation:"Awards points based on how evenly distributed zone types are",code:`// Balanced Development
function calculateScore(context: ScoringContext): number {
  const { countZonesOfType } = context;
  
  const residential = countZonesOfType('residential');
  const commercial = countZonesOfType('commercial');
  const industrial = countZonesOfType('industrial');
  
  // Bonus based on the minimum (most limiting factor)
  const balance = min([residential, commercial, industrial]);
  
  return balance * 3; // 3 points per balanced zone
}`},{id:"geometric_pattern",name:"Geometric Pattern",category:"geometric",description:"Score for specific spatial arrangements",explanation:"Awards bonus for parks surrounded by other zones",code:`// Geometric Pattern Example
function calculateScore(context: ScoringContext): number {
  const { getAllTiles, getAdjacentTiles } = context;
  
  let bonus = 0;
  const tiles = getAllTiles();
  
  for (const tile of tiles) {
    if (tile.type === 'park') {
      const adjacent = getAdjacentTiles(tile.row, tile.col);
      
      // Bonus if park is completely surrounded
      if (adjacent.length >= 3) {
        const nonParkNeighbors = adjacent.filter(t => t.type !== 'park').length;
        if (nonParkNeighbors === adjacent.length) {
          bonus += 5; // 5 points for surrounded parks
        }
      }
    }
  }
  
  return bonus;
}`}];function xn(){const{loadTemplate:t}=se(),s=n=>{t(n)};return e.jsxs("div",{className:"space-y-2",children:[gn.map(n=>e.jsx("div",{className:"card bg-base-100 shadow-sm border border-base-300 cursor-pointer hover:shadow-md transition-shadow",onClick:()=>s(n),children:e.jsx("div",{className:"card-body p-4",children:e.jsxs("div",{className:"flex items-start justify-between",children:[e.jsxs("div",{className:"flex-1",children:[e.jsx("h4",{className:"font-medium text-base-content",children:n.name}),e.jsx("p",{className:"text-sm text-base-content/70 mt-1",children:n.description}),e.jsx("div",{className:"flex items-center gap-2 mt-2",children:e.jsx("div",{className:`badge badge-sm ${n.category==="adjacency"?"badge-primary":n.category==="cluster"?"badge-secondary":n.category==="road"?"badge-accent":n.category==="diversity"?"badge-info":"badge-neutral"}`,children:n.category})})]}),e.jsx("button",{className:"btn btn-ghost btn-sm",children:e.jsx("svg",{className:"w-4 h-4",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M12 6v6m0 0v6m0-6h6m-6 0H6"})})})]})})},n.id)),e.jsx("div",{className:"text-xs text-base-content/60 mt-4 p-2 bg-base-200 rounded",children:"💡 Click any template to load it into the editor. You can then modify it to create your custom scoring logic."})]})}const fn=[{id:"empty_board",name:"Empty Board",description:"No cards placed",boardState:{players:[],currentPlayerIndex:0,deck:[],board:[],topCard:null,gamePhase:"playing",turnCount:0,scoring:{activeConditions:[],targetScore:0}},expectedScore:0},{id:"simple_layout",name:"Simple Layout",description:"Basic 2x2 mixed development",boardState:{players:[],currentPlayerIndex:0,deck:[],board:[{id:"test_card_1",cells:[[{type:"residential",roads:[]},{type:"commercial",roads:[]}],[{type:"park",roads:[]},{type:"industrial",roads:[]}]],x:0,y:0,rotation:0}],topCard:null,gamePhase:"playing",turnCount:0,scoring:{activeConditions:[],targetScore:50}}},{id:"large_development",name:"Large Development",description:"Multiple cards with roads",boardState:{players:[],currentPlayerIndex:0,deck:[],board:[{id:"test_card_2",cells:[[{type:"residential",roads:[[0,1]]},{type:"residential",roads:[[3,2]]}],[{type:"commercial",roads:[[0]]},{type:"commercial",roads:[[1]]}]],x:0,y:0,rotation:0},{id:"test_card_3",cells:[[{type:"park",roads:[]},{type:"industrial",roads:[[2]]}],[{type:"industrial",roads:[[0,1]]},{type:"park",roads:[[3]]}]],x:2,y:0,rotation:0}],topCard:null,gamePhase:"playing",turnCount:0,scoring:{activeConditions:[],targetScore:100}}}];function bn(){const{compilationResult:t,testResults:s,isTesting:n,selectedTestCase:r,runTest:a,runAllTests:i,selectTestCase:o,editingCondition:l}=se(),[c,d]=y.useState(""),m=[...fn,...l?.testCases||[]],g=async u=>{await a(u)},h=async()=>{await i()},C=u=>{o(r===u?void 0:u)},j=t?.success,N=j&&!n;return e.jsxs("div",{className:"space-y-4",children:[e.jsx("div",{className:"flex items-center gap-2",children:e.jsx("button",{className:`btn btn-sm btn-primary flex-1 ${N?"":"btn-disabled"}`,onClick:h,disabled:!N,children:n?e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"loading loading-spinner loading-sm"}),"Testing..."]}):e.jsxs(e.Fragment,{children:[e.jsx("svg",{className:"w-4 h-4",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m2-10a9 9 0 11-18 0 9 9 0 0118 0z"})}),"Run All Tests"]})})}),e.jsx("div",{className:"space-y-2 max-h-96 overflow-y-auto",children:m.map(u=>{const b=s.get(u.id),x=r===u.id;return e.jsxs("div",{className:"space-y-2",children:[e.jsxs("div",{className:`flex items-center justify-between p-3 border border-base-300 rounded cursor-pointer transition-colors ${x?"bg-primary/10 border-primary":"bg-base-100 hover:bg-base-200"}`,onClick:()=>C(u.id),children:[e.jsxs("div",{className:"flex-1",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("h4",{className:"font-medium text-sm",children:u.name}),b&&e.jsx("div",{className:`badge badge-sm ${b.error?"badge-error":"badge-success"}`,children:b.error?"Error":`${b.score} pts`})]}),e.jsx("p",{className:"text-xs text-base-content/70 mt-1",children:u.description})]}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("button",{className:`btn btn-xs ${N?"":"btn-disabled"}`,onClick:p=>{p.stopPropagation(),g(u.id)},disabled:!N,children:e.jsx("svg",{className:"w-3 h-3",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m2-10a9 9 0 11-18 0 9 9 0 0118 0z"})})}),e.jsx("svg",{className:`w-4 h-4 transition-transform ${x?"rotate-90":""}`,fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M9 5l7 7-7 7"})})]})]}),x&&b&&e.jsx("div",{className:"ml-4 p-3 bg-base-100 border border-base-300 rounded",children:b.error?e.jsxs("div",{className:"alert alert-error alert-sm",children:[e.jsx("svg",{className:"w-4 h-4",fill:"currentColor",viewBox:"0 0 20 20",children:e.jsx("path",{fillRule:"evenodd",d:"M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z",clipRule:"evenodd"})}),e.jsx("span",{className:"text-sm",children:b.error})]}):e.jsxs("div",{className:"space-y-2",children:[e.jsxs("div",{className:"flex items-center justify-between text-sm",children:[e.jsxs("span",{children:["Score: ",e.jsxs("strong",{children:[b.score," points"]})]}),e.jsxs("span",{className:"text-base-content/70",children:["Execution time: ",b.executionTime.toFixed(1),"ms"]})]}),u.expectedScore!==void 0&&e.jsxs("div",{className:`text-xs p-2 rounded ${b.score===u.expectedScore?"bg-success/20 text-success-content":"bg-warning/20 text-warning-content"}`,children:["Expected: ",u.expectedScore," points "," ",b.score===u.expectedScore?"✓":"⚠"]}),b.details&&b.details.length>0&&e.jsxs("div",{className:"text-xs",children:[e.jsx("strong",{children:"Details:"}),e.jsx("ul",{className:"mt-1 space-y-1",children:b.details.map((p,w)=>e.jsxs("li",{className:"flex justify-between",children:[e.jsx("span",{children:p.description}),e.jsxs("span",{children:[p.points," pts"]})]},w))})]})]})})]},u.id)})}),!j&&e.jsx("div",{className:"text-xs text-base-content/60 p-2 bg-base-200 rounded",children:"💡 Compile your formula first to run tests"}),m.length===0&&e.jsxs("div",{className:"text-center text-base-content/60 py-8",children:[e.jsx("svg",{className:"w-8 h-8 mx-auto mb-2 opacity-50",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"})}),e.jsx("p",{className:"text-sm",children:"No test cases available"}),e.jsx("p",{className:"text-xs",children:"Sample test cases will appear here"})]})]})}function yn({onSave:t,onCancel:s}){const{currentDeck:n}=z(),{isOpen:r,formula:a,compilationResult:i,isCompiling:o,isGlobal:l,editingCondition:c,formulaName:d,formulaDescription:m,targetContribution:g,updateFormula:h,saveCondition:C,closeEditor:j,setIsGlobal:N,updateFormulaName:u,updateFormulaDescription:b,updateTargetContribution:x}=se(),p=y.useRef(null);y.useEffect(()=>{const f=D=>{D.key==="Escape"&&S()};return r&&(document.addEventListener("keydown",f),document.body.style.overflow="hidden"),()=>{document.removeEventListener("keydown",f),document.body.style.overflow=""}},[r]);const w=f=>{f.target===f.currentTarget&&S()},v=()=>{const f=C();f&&(t?.(f),j())},S=()=>{s?.(),j()},k=()=>{};if(!r)return null;const T=i&&!i.success,R=i?.success&&!o;return e.jsx("div",{className:"fixed inset-0 bg-black/50 z-50",onClick:w,children:e.jsxs("div",{ref:p,className:"bg-white h-full w-full overflow-hidden flex flex-col",children:[e.jsxs("div",{className:"flex items-center justify-between p-6 border-b bg-base-100",children:[e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsx("h2",{className:"text-2xl font-bold text-base-content",children:c?"Edit Scoring Formula":"Create Custom Scoring Formula"}),e.jsxs("div",{className:"flex items-center gap-2",children:[o&&e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"loading loading-spinner loading-sm"}),e.jsx("span",{className:"text-sm text-base-content/70",children:"Compiling..."})]}),T&&e.jsxs("div",{className:"badge badge-error gap-2",children:[e.jsx("svg",{className:"w-4 h-4",fill:"currentColor",viewBox:"0 0 20 20",children:e.jsx("path",{fillRule:"evenodd",d:"M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z",clipRule:"evenodd"})}),"Errors"]}),i?.success&&!o&&e.jsxs("div",{className:"badge badge-success gap-2",children:[e.jsx("svg",{className:"w-4 h-4",fill:"currentColor",viewBox:"0 0 20 20",children:e.jsx("path",{fillRule:"evenodd",d:"M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z",clipRule:"evenodd"})}),"Ready"]})]})]}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("button",{className:"btn btn-ghost",onClick:S,children:"Cancel"}),e.jsx("button",{className:`btn btn-primary ${R?"":"btn-disabled"}`,onClick:v,disabled:!R,children:c?"Update Formula":"Save Formula"})]})]}),e.jsxs("div",{className:"flex-1 overflow-hidden flex flex-col",children:[e.jsx("div",{className:"border-b bg-base-50",children:e.jsxs("details",{className:"collapse bg-transparent group",children:[e.jsx("summary",{className:"collapse-title text-lg font-semibold py-3 px-6 hover:bg-base-100/50 cursor-pointer transition-colors list-none",children:e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("svg",{className:"w-4 h-4 transition-transform duration-200 group-open:rotate-90",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M9 5l7 7-7 7"})}),"📝 Formula Details",e.jsx("span",{className:"text-sm text-base-content/60 font-normal ml-auto group-open:hidden",children:"Click to expand"}),e.jsx("span",{className:"text-sm text-base-content/60 font-normal ml-auto hidden group-open:inline",children:"Click to collapse"})]})}),e.jsxs("div",{className:"collapse-content px-6 pb-4 pt-0",children:[e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-4",children:[e.jsxs("div",{children:[e.jsx("label",{htmlFor:"formula-name",className:"block text-sm font-medium mb-1",children:"Name"}),e.jsx("input",{type:"text",id:"formula-name",className:"input input-sm w-full",placeholder:"e.g., Balanced Development Bonus",value:d,onChange:f=>u(f.target.value)})]}),e.jsxs("div",{className:"md:col-span-2",children:[e.jsx("label",{htmlFor:"formula-description",className:"block text-sm font-medium mb-1",children:"Description"}),e.jsx("input",{type:"text",id:"formula-description",className:"input input-sm w-full",placeholder:"Brief description of what this formula rewards...",value:m,onChange:f=>b(f.target.value)})]})]}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4 mt-4",children:[e.jsxs("div",{children:[e.jsx("label",{htmlFor:"target-contribution",className:"block text-sm font-medium mb-1",children:"Target Points"}),e.jsx("input",{type:"number",id:"target-contribution",className:"input input-sm w-full",min:"0",step:"1",placeholder:"10",value:g,onChange:f=>x(parseInt(f.target.value,10)||0)}),e.jsx("p",{className:"text-xs text-base-content/60 mt-1",children:"Expected average contribution to total score"})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium mb-1",children:"Rule Type"}),e.jsxs("div",{className:"flex items-center gap-3 mt-2",children:[e.jsx("input",{type:"checkbox",id:"global-rule",className:"checkbox checkbox-sm",checked:l,onChange:f=>N(f.target.checked)}),e.jsx("label",{htmlFor:"global-rule",className:"text-sm cursor-pointer",children:"Global rule (applies to all games, not tied to specific cards)"})]})]})]})]})]})}),e.jsxs("div",{className:"flex-1 overflow-auto grid grid-cols-1 xl:grid-cols-3 gap-6 p-6 min-h-0",children:[e.jsxs("div",{className:"xl:col-span-2 flex flex-col gap-4",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx("h3",{className:"text-lg font-semibold",children:"TypeScript Formula"}),e.jsx("div",{className:"text-sm text-base-content/70",children:"Write your scoring logic using the available context API"})]}),e.jsx("div",{className:"flex-1 min-h-0 border border-base-300 rounded-lg",children:e.jsx(hn,{value:a,onChange:h,onCompile:k,height:"100%",metadataSchema:n?.metadataSchema})}),T&&e.jsxs("div",{className:"alert alert-error",children:[e.jsx("svg",{className:"w-6 h-6",fill:"currentColor",viewBox:"0 0 20 20",children:e.jsx("path",{fillRule:"evenodd",d:"M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z",clipRule:"evenodd"})}),e.jsxs("div",{children:[e.jsx("h4",{className:"font-medium",children:"Compilation Errors:"}),e.jsx("pre",{className:"text-sm mt-1 whitespace-pre-wrap",children:i.error})]})]}),i?.success&&i.diagnostics&&i.diagnostics.length>0&&e.jsxs("div",{className:"alert alert-warning",children:[e.jsx("svg",{className:"w-6 h-6",fill:"currentColor",viewBox:"0 0 20 20",children:e.jsx("path",{fillRule:"evenodd",d:"M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z",clipRule:"evenodd"})}),e.jsxs("div",{children:[e.jsx("h4",{className:"font-medium",children:"Warnings:"}),e.jsx("div",{className:"text-sm mt-1",children:i.diagnostics.map((f,D)=>e.jsx("div",{children:f},D))})]})]})]}),e.jsxs("div",{className:"flex flex-col gap-4 min-h-0",children:[e.jsxs("div",{className:"flex flex-col min-h-0",style:{maxHeight:"320px"},children:[e.jsxs("div",{className:"flex items-center justify-between mb-2 flex-shrink-0",children:[e.jsx("h3",{className:"text-lg font-semibold",children:"Formula Templates"}),e.jsxs("div",{className:"flex items-center gap-1 text-xs text-base-content/60",children:[e.jsx("svg",{className:"w-4 h-4",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"})}),"Scroll for more"]})]}),e.jsx("div",{className:"flex-1 overflow-y-auto min-h-0 pr-1",children:e.jsx(xn,{})})]}),e.jsxs("div",{className:"flex-1 min-h-0 flex flex-col",children:[e.jsx("h3",{className:"text-lg font-semibold mb-2 flex-shrink-0",children:"Test Your Formula"}),e.jsx("div",{className:"flex-1 min-h-0",children:e.jsx(bn,{})})]})]})]})]}),e.jsx("div",{className:"border-t p-4 bg-base-50",children:e.jsxs("details",{className:"collapse bg-base-100",children:[e.jsx("summary",{className:"collapse-title text-sm font-medium",children:"📚 Available API Reference"}),e.jsx("div",{className:"collapse-content text-xs text-base-content/80",children:e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-4 mt-2",children:[e.jsxs("div",{children:[e.jsx("h4",{className:"font-medium mb-2",children:"Board Utilities"}),e.jsxs("ul",{className:"space-y-1 font-mono",children:[e.jsx("li",{children:"getAllTiles()"}),e.jsx("li",{children:"getTileAt(row, col)"}),e.jsx("li",{children:"getAdjacentTiles(row, col)"})]})]}),e.jsxs("div",{children:[e.jsx("h4",{className:"font-medium mb-2",children:"Zone Analysis"}),e.jsxs("ul",{className:"space-y-1 font-mono",children:[e.jsx("li",{children:"findClusters(type?)"}),e.jsx("li",{children:"findLargestCluster(type)"}),e.jsx("li",{children:"countZonesOfType(type)"})]})]}),e.jsxs("div",{children:[e.jsx("h4",{className:"font-medium mb-2",children:"Scoring Helpers"}),e.jsxs("ul",{className:"space-y-1 font-mono",children:[e.jsx("li",{children:"sum(numbers)"}),e.jsx("li",{children:"max(numbers)"}),e.jsx("li",{children:"min(numbers)"}),e.jsx("li",{children:"count(items, predicate)"})]})]})]})})]})})]})})}function vn(){const{currentDeck:t,addScoringCondition:s,updateScoringCondition:n,removeScoringCondition:r,updateCardInDeck:a}=z(),[i,o]=y.useState(null),{openEditor:l,isOpen:c}=se(),d=()=>{l()},m=p=>{l(p)},g=p=>{(t?.customScoringConditions||[]).some(v=>v.id===p.id)?n(p.id,p):s(p)},h=p=>{const w=t?.customScoringConditions.find(S=>S.id===p);if(!w)return;confirm(`Delete scoring condition "${w.name}"? This will remove it from any cards that use it.`)&&r(p)},C=t?.customScoringConditions||[],N=C.filter(p=>!p.isGlobal&&t?.baseCards.filter(w=>w.scoringConditionId===p.id).length===0),u=()=>t?t.baseCards.map((p,w)=>({...p,index:w})).filter(p=>!p.scoringConditionId):[],b=(p,w)=>{if(!t)return;const v=t.baseCards[p];if(!v)return;const S={...v,scoringConditionId:w};a(p,S),o(null)},x=(p,w)=>{n(p,{isGlobal:w})};return e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("h3",{className:"text-lg font-semibold text-gray-900",children:"Scoring Conditions"}),N.length>0&&e.jsxs("div",{className:"flex items-center gap-2 px-2 py-1 bg-amber-100 text-amber-800 rounded-md text-sm",children:[e.jsx("svg",{className:"w-4 h-4",fill:"currentColor",viewBox:"0 0 20 20",children:e.jsx("path",{fillRule:"evenodd",d:"M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z",clipRule:"evenodd"})}),e.jsxs("span",{className:"font-medium",children:[N.length," unused rule",N.length!==1?"s":""]})]})]}),e.jsxs("button",{onClick:d,className:"btn btn-sm btn-primary",children:[e.jsx("svg",{className:"w-4 h-4 mr-2",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M12 6v6m0 0v6m0-6h6m-6 0H6"})}),"Create Formula"]})]}),N.length>0&&e.jsx("div",{className:"bg-amber-50 border border-amber-200 rounded-lg p-3",children:e.jsxs("div",{className:"flex items-start gap-2",children:[e.jsx("svg",{className:"w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0",fill:"currentColor",viewBox:"0 0 20 20",children:e.jsx("path",{fillRule:"evenodd",d:"M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z",clipRule:"evenodd"})}),e.jsxs("div",{className:"text-sm text-amber-800",children:[e.jsx("p",{className:"font-medium mb-1",children:"Unused scoring conditions detected"}),e.jsxs("p",{children:["You have ",N.length," non-global scoring rule",N.length!==1?"s":""," that"," ",N.length===1?"is":"are"," not assigned to any cards. These rules will never be active during gameplay. Either assign them to cards or make them global rules."]})]})]})}),C.length===0?e.jsxs("div",{className:"text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200",children:[e.jsx("svg",{className:"w-12 h-12 mx-auto mb-4 text-gray-400",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"})}),e.jsx("p",{className:"text-gray-600 mb-2",children:"No custom scoring conditions"}),e.jsx("p",{className:"text-sm text-gray-500 mb-4",children:"Create TypeScript scoring formulas to customize your deck's gameplay"}),e.jsx("button",{onClick:d,className:"btn btn-primary",children:"Create Your First Formula"})]}):e.jsx("div",{className:"space-y-3",children:C.map(p=>{const w=t?.baseCards.filter(T=>T.scoringConditionId===p.id).length||0,v=u(),S=i===p.id,k=!p.isGlobal&&w===0;return e.jsxs("div",{className:`bg-white rounded-lg p-4 ${k?"border-2 border-amber-300 bg-amber-50":"border border-gray-200"}`,children:[e.jsxs("div",{className:"flex items-start justify-between",children:[e.jsxs("div",{className:"flex-1",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("h4",{className:"font-medium text-gray-900",children:p.name}),p.isGlobal&&e.jsx("span",{className:"inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800",children:"Global"}),k&&e.jsx("span",{className:"inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800",children:"Unused"})]}),e.jsx("p",{className:"text-sm text-gray-600 mt-1",children:p.description}),e.jsxs("div",{className:"flex items-center gap-2 mt-2",children:[e.jsx("span",{className:"inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800",children:"TypeScript"}),e.jsxs("span",{className:"text-xs text-gray-500",children:["Target: ",p.targetContribution," pts"]}),e.jsxs("span",{className:"text-xs text-gray-500",children:["Updated ",p.updatedAt?.toLocaleDateString?.()]})]})]}),e.jsxs("div",{className:"flex gap-1 ml-4",children:[e.jsx("button",{onClick:()=>m(p),className:"btn btn-ghost btn-sm",title:"Edit",children:e.jsx("svg",{className:"w-4 h-4",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"})})}),e.jsx("button",{onClick:()=>h(p.id),className:"btn btn-ghost btn-sm text-red-600 hover:text-red-800",title:"Delete",children:e.jsx("svg",{className:"w-4 h-4",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"})})})]})]}),e.jsxs("div",{className:"mt-3 pt-3 border-t border-gray-100 space-y-3",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("input",{type:"checkbox",id:`global-${p.id}`,className:"checkbox checkbox-sm",checked:p.isGlobal||!1,onChange:T=>x(p.id,T.target.checked)}),e.jsx("label",{htmlFor:`global-${p.id}`,className:"text-sm text-gray-700 cursor-pointer",children:"Global rule (applies to all games, not tied to specific cards)"})]}),!p.isGlobal&&e.jsxs("div",{className:"space-y-2",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs("p",{className:"text-xs text-gray-500",children:["Used by ",w," card(s)"]}),v.length>0&&e.jsx("button",{onClick:()=>o(S?null:p.id),className:"btn btn-xs btn-outline",children:S?"Cancel":"Assign to Card"})]}),S&&v.length>0&&e.jsxs("div",{className:"bg-gray-50 rounded p-2",children:[e.jsx("p",{className:"text-xs text-gray-600 mb-2",children:"Select a card to assign this condition:"}),e.jsx("div",{className:"space-y-1 max-h-32 overflow-y-auto",children:v.map(T=>e.jsxs("button",{onClick:()=>b(T.index,p.id),className:"w-full text-left px-2 py-1 text-sm bg-white border border-gray-200 rounded hover:bg-gray-100 flex items-center justify-between",children:[e.jsx("span",{children:T.name||`Card ${T.index+1}`}),e.jsxs("span",{className:"text-xs text-gray-500",children:[T.count," copies"]})]},T.index))})]}),v.length===0&&w===0&&!p.isGlobal&&e.jsx("p",{className:"text-xs text-amber-600",children:"No cards available for assignment. All cards already have scoring conditions."})]}),p.isGlobal&&e.jsx("p",{className:"text-xs text-purple-600",children:"This global rule will be available in all games using this deck."})]})]},p.id)})}),c&&e.jsx(yn,{onSave:g,onCancel:()=>{}})]})}function jn(){const{currentDeck:t,openCardBuilder:s,removeCardFromDeck:n,duplicateCardInDeck:r}=z();if(!t)return null;const a=(l,c)=>{s(l,c)},i=l=>{r(l)},o=l=>{confirm("Are you sure you want to delete this card?")&&n(l)};return t.baseCards.length===0?e.jsxs("div",{className:"text-center py-12",children:[e.jsx("div",{className:"text-gray-400 mb-4",children:e.jsx("svg",{className:"w-16 h-16 mx-auto",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:1,d:"M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"})})}),e.jsx("h3",{className:"text-lg font-medium text-gray-900 mb-2",children:"No cards in deck"}),e.jsx("p",{className:"text-gray-600 mb-6",children:"Start building your deck by adding cards from the library or creating new ones."}),e.jsx("button",{onClick:()=>s(),className:"btn btn-primary",children:"Create Your First Card"})]}):e.jsxs("div",{className:"space-y-6",children:[e.jsx("div",{className:"grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4",children:t.baseCards.map((l,c)=>e.jsxs("div",{className:"group relative bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors",children:[e.jsx("div",{className:"flex justify-center mb-3",children:e.jsx(Te,{card:l,width:80,height:80,showBorder:!0,borderColor:"border-gray-300",className:"group-hover:shadow-md transition-shadow",zoneTypes:t?.zoneTypes})}),e.jsxs("div",{className:"text-center",children:[e.jsx("h4",{className:"text-sm font-medium text-gray-900 truncate",children:l.name||`Card ${c+1}`}),e.jsxs("p",{className:"text-xs text-gray-500 mt-1",children:["Count: ",l.count]})]}),e.jsx("div",{className:"absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center",children:e.jsxs("div",{className:"flex gap-2",children:[e.jsx("button",{onClick:()=>a(l,c),className:"btn btn-sm btn-primary",title:"Edit card",children:e.jsx("svg",{className:"w-4 h-4",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"})})}),e.jsx("button",{onClick:()=>i(c),className:"btn btn-sm btn-secondary",title:"Duplicate card",children:e.jsx("svg",{className:"w-4 h-4",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"})})}),e.jsx("button",{onClick:()=>o(c),className:"btn btn-sm btn-error",title:"Delete card",children:e.jsx("svg",{className:"w-4 h-4",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"})})})]})})]},`${l.id}-${c}`))}),e.jsxs("div",{className:"bg-blue-50 border border-blue-200 rounded-lg p-4",children:[e.jsx("h3",{className:"text-sm font-medium text-blue-900 mb-2",children:"Deck Summary"}),e.jsxs("div",{className:"grid grid-cols-2 md:grid-cols-4 gap-4 text-sm",children:[e.jsxs("div",{children:[e.jsx("span",{className:"text-blue-600",children:"Total Cards:"}),e.jsx("span",{className:"ml-2 font-medium",children:t.baseCards.length})]}),e.jsxs("div",{children:[e.jsx("span",{className:"text-blue-600",children:"Total Count:"}),e.jsx("span",{className:"ml-2 font-medium",children:t.baseCards.reduce((l,c)=>l+c.count,0)})]}),e.jsxs("div",{children:[e.jsx("span",{className:"text-blue-600",children:"Unique Cards:"}),e.jsx("span",{className:"ml-2 font-medium",children:t.baseCards.length})]}),e.jsxs("div",{children:[e.jsx("span",{className:"text-blue-600",children:"Theme:"}),e.jsxs("span",{className:"ml-2 flex items-center gap-1",children:[e.jsx("div",{className:"w-3 h-3 rounded border",style:{backgroundColor:t.theme.primaryColor}}),e.jsx("div",{className:"w-3 h-3 rounded border",style:{backgroundColor:t.theme.secondaryColor}})]})]})]})]})]})}function Cn({selectedZone:t,onZoneSelect:s}){const{editingCard:n,setEditingCard:r,pushToUndo:a,currentDeck:i}=z(),[o,l]=y.useState(!1),[c,d]=y.useState(null),[m,g]=y.useState(null);if(!n||!i)return null;const h=i.zoneTypes||[],C=(x,p)=>{if(!o)if(m){a(n);const w=n.cells.map((v,S)=>v.map((k,T)=>S===x&&T===p?{...k,type:m}:k));r({...n,cells:w})}else{const w={row:x,col:p};t&&t.row===x&&t.col===p?s(null):s(w)}},j=(x,p,w,v)=>{v.stopPropagation();const S={zone:{row:x,col:p},edge:w};if(!o)d(S),l(!0);else if(c){if(c.zone.row===x&&c.zone.col===p&&c.edge===w){l(!1),d(null);return}if(c.zone.row!==x||c.zone.col!==p){d(S);return}const k=[c.edge,w];a(n);const T=n.cells.map((R,f)=>R.map((D,L)=>{if(f===x&&L===p){const _=D.roads||[];return{...D,roads:[..._,k]}}return D}));r({...n,cells:T}),l(!1),d(null)}},N=x=>h.find(w=>w.id===x)?.color||"#e5e7eb",u=x=>{switch(x){case 0:return"Top";case 1:return"Right";case 2:return"Bottom";case 3:return"Left";default:return"Unknown"}},b=()=>e.jsxs("div",{className:"mb-6",children:[e.jsxs("h4",{className:"text-sm font-medium text-gray-700 mb-3",children:["Zone Type Brush"," ",m&&e.jsx("span",{className:"text-blue-600",children:"(Active)"})]}),e.jsxs("div",{className:"flex flex-wrap gap-2",children:[h.map(x=>e.jsxs("button",{className:`flex items-center gap-2 px-3 py-2 rounded border text-sm transition-colors ${m===x.id?"border-blue-500 bg-blue-50 text-blue-700":"border-gray-300 hover:border-gray-400"}`,onClick:()=>g(m===x.id?null:x.id),children:[e.jsx("div",{className:"w-4 h-4 rounded border border-gray-300",style:{backgroundColor:x.color}}),x.name]},x.id)),m&&e.jsx("button",{className:"px-3 py-2 rounded border border-gray-300 text-sm text-gray-600 hover:bg-gray-50",onClick:()=>g(null),children:"Clear Brush"})]})]});return e.jsxs("div",{className:"space-y-6",children:[e.jsx(b,{}),e.jsx("div",{className:"text-sm text-gray-600",children:o&&c?e.jsxs("div",{className:"bg-green-50 border border-green-200 rounded p-3 text-green-800",children:[e.jsx("strong",{children:"Drawing road from:"})," Zone (",c.zone.row+1,","," ",c.zone.col+1,") - ",u(c.edge)," edge",e.jsx("div",{className:"text-xs text-green-600 mt-1",children:"Click another edge in the same zone to complete, or a different edge to start over."})]}):null}),e.jsx("div",{className:"mx-auto",style:{width:"280px",height:"280px"},children:e.jsx("div",{className:"relative w-full h-full bg-gray-100 rounded-lg border-2 border-gray-300 p-4",children:e.jsx("div",{className:"grid grid-cols-2 grid-rows-2 gap-3 h-full w-full",children:n.cells.map((x,p)=>x.map((w,v)=>e.jsxs("div",{className:`relative rounded border-2 cursor-pointer transition-all ${t&&t.row===p&&t.col===v?"border-blue-500 ring-2 ring-blue-200 shadow-lg":"border-gray-400 hover:border-gray-600"}`,style:{backgroundColor:N(w.type)},onClick:()=>C(p,v),children:[e.jsx("div",{className:"absolute inset-0 flex items-center justify-center",children:e.jsx("div",{className:"bg-black/20 text-white text-xs px-1 py-0.5 rounded font-medium",children:h.find(S=>S.id===w.type)?.name||w.type})}),[0,1,2,3].map(S=>{const k=[{top:"-8px",left:"50%",transform:"translateX(-50%)"},{top:"50%",right:"-8px",transform:"translateY(-50%)"},{bottom:"-8px",left:"50%",transform:"translateX(-50%)"},{top:"50%",left:"-8px",transform:"translateY(-50%)"}],T=c?.zone.row===p&&c?.zone.col===v&&c?.edge===S;return e.jsx("div",{className:`absolute w-4 h-4 rounded-full border-2 cursor-crosshair transition-all z-10 ${T?"bg-green-500 border-white shadow-lg scale-125":"bg-white border-gray-600 hover:bg-gray-100 hover:scale-110"}`,style:k[S],onClick:R=>j(p,v,S,R),title:`${u(S)} edge`},S)}),w.roads&&w.roads.length>0&&e.jsx("svg",{className:"absolute inset-0 pointer-events-none",viewBox:"0 0 100 100",preserveAspectRatio:"none",children:w.roads.map((S,k)=>{const[T,R]=S,f={0:{x:50,y:0},1:{x:100,y:50},2:{x:50,y:100},3:{x:0,y:50}},D=f[T],L=f[R],_={x:50,y:50},B=(T+R)%2===0;return e.jsx("g",{children:B?e.jsx("line",{x1:D.x,y1:D.y,x2:L.x,y2:L.y,stroke:"#374151",strokeWidth:"4",strokeLinecap:"round"}):e.jsx("polyline",{points:`${D.x},${D.y} ${_.x},${_.y} ${L.x},${L.y}`,fill:"none",stroke:"#374151",strokeWidth:"4",strokeLinecap:"round",strokeLinejoin:"round"})},k)})})]},`${p}-${v}`)))})})}),e.jsxs("div",{className:"bg-gray-50 rounded-lg p-4 text-sm text-gray-600",children:[e.jsx("div",{className:"font-medium mb-2",children:"How to use:"}),e.jsxs("ul",{className:"space-y-1 text-xs",children:[e.jsxs("li",{children:["• ",e.jsx("strong",{children:"Select zones:"})," Click zone centers to select them for detailed editing (right panel)"]}),e.jsxs("li",{children:["• ",e.jsx("strong",{children:"Paint zones:"})," Select a zone type above, then click zones to paint them"]}),e.jsxs("li",{children:["• ",e.jsx("strong",{children:"Draw roads:"})," Click edge handles (circles) to connect them within a zone"]}),e.jsxs("li",{children:["• ",e.jsx("strong",{children:"Cancel road:"})," Click the same edge handle to cancel drawing"]}),e.jsxs("li",{children:["• ",e.jsx("strong",{children:"Multiple roads:"})," Each zone can have multiple road segments"]})]})]})]})}function Nn(t,s){const n=[];for(const r of s){if(r.required&&(t[r.id]===void 0||t[r.id]===null)){n.push({fieldId:r.id,message:`${r.name} is required`});continue}const a=t[r.id];if(a!=null)switch(r.type){case"number":typeof a!="number"||isNaN(a)?n.push({fieldId:r.id,message:`${r.name} must be a valid number`}):(r.min!==void 0&&a<r.min&&n.push({fieldId:r.id,message:`${r.name} must be at least ${r.min}`}),r.max!==void 0&&a>r.max&&n.push({fieldId:r.id,message:`${r.name} must be at most ${r.max}`}));break;case"text":typeof a!="string"&&n.push({fieldId:r.id,message:`${r.name} must be text`});break;case"boolean":typeof a!="boolean"&&n.push({fieldId:r.id,message:`${r.name} must be true or false`});break;case"select":(typeof a!="string"||!r.options?.includes(a))&&n.push({fieldId:r.id,message:`${r.name} must be one of: ${r.options?.join(", ")}`});break}}return n}function ue(t){const s={};for(const n of t)if(n.defaultValue!==void 0)s[n.id]=n.defaultValue;else if(n.required)switch(n.type){case"number":s[n.id]=n.min??0;break;case"text":s[n.id]="";break;case"boolean":s[n.id]=!1;break;case"select":s[n.id]=n.options?.[0]??"";break}return s}function U(t){const s=[],n=new Set;for(const r of t)n.has(r.id)?s.push({fieldId:r.id,message:`Field ID "${r.id}" is already used`}):n.add(r.id),/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(r.id)||s.push({fieldId:r.id,message:`Field ID "${r.id}" must be a valid identifier (letters, numbers, underscore)`}),r.type==="select"&&(!r.options||r.options.length===0)&&s.push({fieldId:r.id,message:`Select field "${r.name}" must have at least one option`}),r.type==="number"&&r.min!==void 0&&r.max!==void 0&&r.min>r.max&&s.push({fieldId:r.id,message:`Field "${r.name}" minimum value cannot be greater than maximum value`});return s}function wn({zoneData:t,cardIndex:s,zoneRow:n,zoneCol:r,metadataSchema:a,onMetadataChange:i}){const{updateZoneMetadata:o,currentDeck:l}=z(),[c,d]=y.useState(()=>{if(t.customMetadata)return{...t.customMetadata};const u=l?.zoneTypes?.find(b=>b.id===t.type);return u?.defaultMetadata?{...u.defaultMetadata}:a?ue(a.fields):{}});if(y.useEffect(()=>{if(t.customMetadata)d({...t.customMetadata});else if(a){const b=l?.zoneTypes?.find(x=>x.id===t.type)?.defaultMetadata||ue(a.fields);d(b)}},[t.customMetadata,t.type,a,l]),!a||a.fields.length===0)return e.jsx("div",{className:"text-center py-3",children:e.jsx("div",{className:"text-gray-500 text-sm",children:"No metadata schema defined"})});const m=Nn(c,a.fields),g=m.length>0,h=(u,b)=>{const x={...c,[u]:b};d(x),i?.(x)},C=()=>{g||o(s,n,r,c)},j=()=>{const b=l?.zoneTypes?.find(x=>x.id===t.type)?.defaultMetadata||ue(a.fields);d(b),i?.(b)},N=u=>{const b=c[u.id],x=m.find(p=>p.fieldId===u.id);switch(u.type){case"text":return e.jsx("input",{type:"text",className:`input input-bordered input-sm w-full ${x?"input-error":""}`,value:b||"",onChange:p=>h(u.id,p.target.value),placeholder:`Enter ${u.name.toLowerCase()}`});case"number":return e.jsx("input",{type:"number",className:`input input-bordered input-sm w-full ${x?"input-error":""}`,value:b||"",onChange:p=>h(u.id,parseFloat(p.target.value)||0),min:u.min,max:u.max,step:"any"});case"boolean":return e.jsx("div",{className:"form-control",children:e.jsxs("label",{className:"label cursor-pointer justify-start",children:[e.jsx("input",{type:"checkbox",className:"checkbox checkbox-sm mr-2",checked:b||!1,onChange:p=>h(u.id,p.target.checked)}),e.jsx("span",{className:"label-text text-sm",children:b?"Yes":"No"})]})});case"select":return e.jsxs("select",{className:`select select-bordered select-sm w-full ${x?"select-error":""}`,value:b||"",onChange:p=>h(u.id,p.target.value),children:[e.jsx("option",{value:"",children:"Choose..."}),u.options?.map(p=>e.jsx("option",{value:p,children:p},p))]});default:return e.jsxs("div",{className:"text-gray-500 italic text-sm",children:["Unsupported field type: ",u.type]})}};return e.jsxs("div",{className:"space-y-3",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx("h5",{className:"font-medium text-sm",children:"Zone Metadata"}),e.jsxs("div",{className:"flex space-x-1",children:[e.jsx("button",{className:"btn btn-ghost btn-xs",onClick:j,children:"Reset"}),e.jsx("button",{className:"btn btn-primary btn-xs",onClick:C,disabled:g,children:"Save"})]})]}),g&&e.jsx("div",{className:"alert alert-error alert-sm py-2",children:e.jsx("div",{className:"text-xs",children:m.map((u,b)=>e.jsx("div",{children:u.message},b))})}),e.jsx("div",{className:"space-y-3",children:a.fields.map(u=>{const b=m.find(x=>x.fieldId===u.id);return e.jsxs("div",{className:"space-y-1",children:[e.jsxs("label",{className:"label py-1",children:[e.jsxs("span",{className:"label-text text-sm flex items-center",children:[u.name,u.required&&e.jsx("span",{className:"text-error ml-1",children:"*"})]}),u.description&&e.jsx("span",{className:"label-text-alt text-xs text-gray-500",children:u.description})]}),N(u),b&&e.jsx("div",{className:"text-error text-xs",children:b.message}),u.type==="number"&&(u.min!==void 0||u.max!==void 0)&&e.jsxs("div",{className:"text-xs text-gray-500",children:["Range: ",u.min??"−∞"," to ",u.max??"∞"]})]},u.id)})}),e.jsx("div",{className:"text-xs text-gray-500 border-t pt-2",children:Object.keys(c).length>0?"Has custom metadata":"Using defaults"})]})}function we(){const{editingCard:t,setEditingCard:s,currentDeck:n}=z();if(!t)return null;const r=o=>{s({...t,name:o.target.value})},a=o=>{const l=Math.max(1,Math.min(10,parseInt(o.target.value)||1));s({...t,count:l})},i=o=>{s({...t,scoringConditionId:o||void 0})};return e.jsxs("div",{className:"space-y-6",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Card Name"}),e.jsx("input",{type:"text",className:"input input-bordered w-full",value:t.name||"",onChange:r,placeholder:"Enter card name"})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Count in Deck"}),e.jsx("input",{type:"number",min:"1",max:"10",className:"input input-bordered w-full",value:t.count||1,onChange:a})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Scoring Condition"}),e.jsxs("select",{className:"select select-bordered w-full",value:t.scoringConditionId||"",onChange:o=>i(o.target.value),children:[e.jsx("option",{value:"",children:"No scoring condition"}),n?.customScoringConditions?.map(o=>e.jsx("option",{value:o.id,children:o.name},o.id))]}),e.jsxs("p",{className:"text-xs text-gray-600 mt-1",children:["Scoring conditions are managed at the deck level.",n?.customScoringConditions?.length===0&&e.jsxs("span",{className:"text-yellow-600",children:[" ","No conditions available - create them in the deck editor."]})]})]}),e.jsxs("div",{children:[e.jsx("h4",{className:"text-sm font-medium text-gray-700 mb-3",children:"Preview"}),e.jsx("div",{className:"flex justify-center",children:e.jsx(Te,{card:t,width:120,height:120,showBorder:!0,borderColor:"border-gray-300",className:"shadow-sm",zoneTypes:n?.zoneTypes})})]}),e.jsxs("div",{className:"bg-gray-50 rounded-lg p-3",children:[e.jsx("h4",{className:"text-sm font-medium text-gray-700 mb-2",children:"Card Status"}),e.jsxs("div",{className:"space-y-1 text-sm",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("svg",{className:"w-4 h-4 text-green-500",fill:"currentColor",viewBox:"0 0 20 20",children:e.jsx("path",{fillRule:"evenodd",d:"M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z",clipRule:"evenodd"})}),e.jsx("span",{className:"text-green-700",children:"All zones defined"})]}),t.cells.some(o=>o.some(l=>l.roads&&l.roads.length>0))?e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("svg",{className:"w-4 h-4 text-green-500",fill:"currentColor",viewBox:"0 0 20 20",children:e.jsx("path",{fillRule:"evenodd",d:"M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z",clipRule:"evenodd"})}),e.jsx("span",{className:"text-green-700",children:"Roads present"})]}):e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("svg",{className:"w-4 h-4 text-yellow-500",fill:"currentColor",viewBox:"0 0 20 20",children:e.jsx("path",{fillRule:"evenodd",d:"M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z",clipRule:"evenodd"})}),e.jsx("span",{className:"text-yellow-700",children:"No roads yet"})]})]})]})]})}function Sn({selectedZone:t}){const{editingCard:s,setEditingCard:n,currentDeck:r}=z();if(!s||!r)return null;const a=s.cells[t.row][t.col],i=r.zoneTypes||[],o=c=>i.find(m=>m.id===c)?.color||"#e5e7eb",l=c=>{const d=s.cells.map((m,g)=>m.map((h,C)=>g===t.row&&C===t.col?{...h,type:c}:h));n({...s,cells:d})};return e.jsxs("div",{className:"space-y-6",children:[e.jsxs("div",{className:"bg-blue-50 border border-blue-200 rounded-lg p-4",children:[e.jsxs("div",{className:"flex items-center gap-3 mb-3",children:[e.jsx("div",{className:"w-6 h-6 rounded border-2",style:{backgroundColor:o(a.type)}}),e.jsxs("div",{children:[e.jsxs("h4",{className:"font-medium",children:["Zone ",t.row+1,"-",t.col+1]}),e.jsx("p",{className:"text-sm text-gray-600",children:i.find(c=>c.id===a.type)?.name||a.type})]})]}),e.jsxs("div",{className:"space-y-3",children:[e.jsx("div",{className:"text-sm font-medium text-blue-800",children:"Zone Type:"}),e.jsx("div",{className:"grid grid-cols-1 gap-2",children:i.map(c=>e.jsxs("button",{className:`btn btn-sm justify-start gap-3 ${a.type===c.id?"btn-primary":"btn-outline hover:btn-primary hover:btn-outline-0"}`,onClick:()=>l(c.id),children:[e.jsx("div",{className:"w-4 h-4 rounded border border-gray-300",style:{backgroundColor:c.color}}),c.name,c.description&&e.jsxs("span",{className:"text-xs opacity-70",children:["(",c.description,")"]})]},c.id))})]}),a.roads&&a.roads.length>0&&e.jsxs("div",{className:"text-xs text-blue-700 bg-blue-100 rounded px-2 py-1 mt-3",children:["This zone has ",a.roads.length," road segment",a.roads.length!==1?"s":""]})]}),r?.metadataSchema&&r.metadataSchema.fields&&r.metadataSchema.fields.length>0?e.jsxs("div",{children:[e.jsx("h4",{className:"text-sm font-medium text-gray-700 mb-3",children:"Zone Metadata"}),e.jsx(wn,{zoneData:a,cardIndex:-1,zoneRow:t.row,zoneCol:t.col,metadataSchema:r.metadataSchema,onMetadataChange:c=>{const d=s.cells.map((m,g)=>m.map((h,C)=>g===t.row&&C===t.col?{...h,customMetadata:c}:h));n({...s,cells:d})}})]}):e.jsxs("div",{className:"bg-gray-50 border border-gray-200 rounded-lg p-3",children:[e.jsx("h4",{className:"text-sm font-medium text-gray-700 mb-2",children:"Zone Metadata"}),e.jsxs("div",{className:"text-sm text-gray-600",children:["No metadata schema defined for this deck.",e.jsx("br",{}),e.jsx("span",{className:"text-xs",children:"Go to the deck's Metadata Editor to create custom fields."})]})]})]})}function kn({selectedZone:t}){const[s,n]=y.useState("card");G.useEffect(()=>{t&&n("zone")},[t]);const r=[{id:"card",name:"Card Settings"},...t?[{id:"zone",name:`Zone ${t.row+1}-${t.col+1} Details`}]:[]];return e.jsxs("div",{className:"space-y-6",children:[r.length>1&&e.jsx("div",{className:"flex border-b border-gray-200",children:r.map(a=>e.jsx("button",{onClick:()=>n(a.id),className:`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${s===a.id?"border-blue-500 text-blue-600":"border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`,children:a.name},a.id))}),e.jsx("div",{className:"flex-1",children:s==="card"?e.jsx(we,{}):s==="zone"&&t?e.jsx(Sn,{selectedZone:t}):e.jsx(we,{})})]})}function Tn(){const{isCardBuilderOpen:t,editingCard:s,editingCardIndex:n,currentDeck:r,setEditingCard:a,closeCardBuilder:i,addCardToDeck:o,updateCardInDeck:l,undo:c,redo:d,undoStack:m,redoStack:g}=z(),[h,C]=y.useState(null);if(!t||!s)return null;const j=()=>{if(!s)return;const x={...s,name:s.name||"Custom Card",count:s.count||1};n!==null?l(n,x):o(x),i()},N=()=>{m.length>0&&!confirm("You have unsaved changes. Are you sure you want to discard them?")||i()},u=()=>{c()},b=()=>{d()};return e.jsx("div",{className:"fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4",children:e.jsxs("div",{className:"bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col",children:[e.jsxs("div",{className:"flex items-center justify-between p-6 border-b border-gray-200",children:[e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsx("h2",{className:"text-2xl font-bold text-gray-900",children:n!==null?"Edit Card":"Create Card"}),e.jsxs("div",{className:"flex gap-1",children:[e.jsx("button",{onClick:u,disabled:m.length===0,className:"btn btn-sm btn-ghost",title:"Undo",children:e.jsx("svg",{className:"w-4 h-4",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"})})}),e.jsx("button",{onClick:b,disabled:g.length===0,className:"btn btn-sm btn-ghost",title:"Redo",children:e.jsx("svg",{className:"w-4 h-4",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M21 10H11a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6"})})})]})]}),e.jsxs("div",{className:"flex gap-3",children:[e.jsx("button",{onClick:N,className:"btn btn-ghost",children:"Cancel"}),e.jsx("button",{onClick:j,className:"btn btn-primary",children:"Save Card"})]})]}),e.jsxs("div",{className:"flex-1 grid grid-cols-1 lg:grid-cols-2 overflow-hidden",children:[e.jsxs("div",{className:"p-6 border-r border-gray-200 overflow-y-auto",children:[e.jsx("h3",{className:"text-lg font-semibold mb-4",children:"Card Editor"}),e.jsx(Cn,{selectedZone:h,onZoneSelect:C})]}),e.jsx("div",{className:"p-6 overflow-y-auto",children:e.jsx(kn,{selectedZone:h})})]})]})})}class Dn{config;constructor(s={}){this.config={includeScoring:!0,includeBalance:!0,includeComplexity:!0,...s}}analyzeDeck(s){const n=this.calculateDeckBalance(s),r=this.generateSuggestions(s,n);return{deck:s,balance:n,suggestions:r,analysisDate:new Date,version:"1.0.0"}}calculateDeckBalance(s){const n=s.baseCards.reduce((d,m)=>d+m.count,0),r=this.analyzeZoneDistribution(s),a=this.analyzeRoadComplexity(s),i=this.analyzeScoringPotential(s),o=this.calculateRecommendedPlayerCount(n),l=this.calculateDifficulty(s,a),c=this.calculateBalanceScore(r,a,n);return{cardCount:n,zoneDistribution:r,roadComplexity:a,scoringPotential:i,recommendedPlayerCount:o,difficulty:l,balanceScore:c}}analyzeZoneDistribution(s){const n={};let r=0;s.zoneTypes.forEach(i=>{n[i.id]=0}),s.baseCards.forEach(i=>{for(let o=0;o<i.cells.length;o++)for(let l=0;l<i.cells[o].length;l++){const c=i.cells[o][l].type;n[c]=(n[c]||0)+i.count,r+=i.count}});const a={};return Object.entries(n).forEach(([i,o])=>{a[i]=r>0?Math.round(o/r*100):0}),a}analyzeRoadComplexity(s){let n=0,r=0,a=0;s.baseCards.forEach(o=>{const l=this.calculateCardRoadComplexity(o);l<=2?n+=o.count:l<=4?r+=o.count:a+=o.count});const i=n+r+a;return{simple:i>0?Math.round(n/i*100):0,medium:i>0?Math.round(r/i*100):0,complex:i>0?Math.round(a/i*100):0}}calculateCardRoadComplexity(s){let n=0,r=0;for(let a=0;a<s.cells.length;a++)for(let i=0;i<s.cells[a].length;i++){const o=s.cells[a][i];o.roads&&o.roads.length>0&&(n+=o.roads.length,r++)}return n+(r>2?1:0)}analyzeScoringPotential(s){const n=s.customScoringConditions||[];if(n.length===0)return{min:0,max:0,average:0};const a=n.map(i=>i.targetContribution||0).reduce((i,o)=>(i||0)+(o||0),0);return{min:Math.round((a||0)*.3),max:Math.round((a||0)*1.5),average:Math.round((a||0)*.8)}}calculateRecommendedPlayerCount(s){return s<12?[1,2]:s<20?[2,3]:s<30?[2,3,4]:[3,4,5]}calculateDifficulty(s,n){let r=0;r+=n.complex*2+n.medium*1;const a=s.customScoringConditions||[];r+=a.length*10,r+=s.zoneTypes.length*5;const i=s.metadataSchema?.fields||[];return r+=i.length*3,r<30?"beginner":r<70?"intermediate":"advanced"}calculateBalanceScore(s,n,r){let a=10;const i=Object.values(s),o=Math.max(...i),l=Math.min(...i.filter(c=>c>0));return o>70&&(a-=3),o-l>50&&(a-=2),n.complex>60&&(a-=2),n.simple>80&&(a-=1),r<8&&(a-=2),r>40&&(a-=1),Math.max(0,Math.min(10,a))}generateSuggestions(s,n){const r=[],a=Math.max(...Object.values(n.zoneDistribution)),o=Object.entries(n.zoneDistribution).find(([c,d])=>d===a);if(a>60&&o){const c=s.zoneTypes.find(d=>d.id===o[0])?.name||o[0];r.push({id:"zone-balance-dominant",type:"warning",category:"balance",title:`${c} zones are dominant`,description:`${c} zones make up ${a}% of your deck. Consider reducing their count for better balance.`,priority:"medium",actionable:!0})}s.zoneTypes.length<4&&r.push({id:"zone-variety",type:"suggestion",category:"theme",title:"Add more zone types",description:"Consider adding more zone types to increase strategic depth and visual variety.",priority:"low",actionable:!0}),n.roadComplexity.complex>50&&r.push({id:"road-complexity-high",type:"warning",category:"complexity",title:"High road complexity",description:"Over half your cards have complex road patterns. Consider simplifying some for better accessibility.",priority:"medium",actionable:!0}),n.roadComplexity.simple>80&&r.push({id:"road-complexity-low",type:"suggestion",category:"complexity",title:"Low road complexity",description:"Most cards have simple road patterns. Adding some complex roads could increase strategic depth.",priority:"low",actionable:!0});const l=s.customScoringConditions||[];return l.length===0&&r.push({id:"no-scoring",type:"suggestion",category:"scoring",title:"Add custom scoring conditions",description:"Custom scoring conditions make your deck unique and interesting. Consider adding some!",priority:"medium",actionable:!0}),l.length>5&&r.push({id:"too-many-scoring",type:"warning",category:"scoring",title:"Many scoring conditions",description:"You have many scoring conditions. Consider consolidating some to avoid overwhelming players.",priority:"low",actionable:!0}),n.cardCount<8&&r.push({id:"deck-too-small",type:"warning",category:"balance",title:"Deck is quite small",description:"Your deck has few cards. Consider adding more variety for longer, more interesting games.",priority:"high",actionable:!0}),n.cardCount>35&&r.push({id:"deck-large",type:"suggestion",category:"balance",title:"Large deck",description:"Your deck is quite large. Ensure all cards serve a purpose to maintain engagement.",priority:"low",actionable:!0}),n.balanceScore<6&&r.push({id:"balance-score-low",type:"warning",category:"balance",title:"Balance could be improved",description:"Your deck balance score is low. Review the other suggestions to improve overall balance.",priority:"high",actionable:!1}),r}}const Rn=ne()((t,s)=>({currentAnalysis:null,isAnalyzing:!1,analysisConfig:{includeScoring:!0,includeBalance:!0,includeComplexity:!0},analysisHistory:[],analyzeDeck:async n=>{t({isAnalyzing:!0});try{const a=new Dn(s().analysisConfig).analyzeDeck(n),{analysisHistory:i}=s(),o=[a,...i.slice(0,9)];t({currentAnalysis:a,isAnalyzing:!1,analysisHistory:o})}catch(r){console.error("Error analyzing deck:",r),t({isAnalyzing:!1})}},setAnalysisConfig:n=>{t(r=>({analysisConfig:{...r.analysisConfig,...n}}))},clearAnalysis:()=>{t({currentAnalysis:null})},clearHistory:()=>{t({analysisHistory:[]})},getBalanceScore:()=>{const{currentAnalysis:n}=s();return n?.balance.balanceScore||0},getSuggestionsBy:(n,r)=>{const{currentAnalysis:a}=s();if(!a)return[];let i=a.suggestions;return n&&(i=i.filter(o=>o.category===n)),r&&(i=i.filter(o=>o.priority===r)),i},getZoneDistribution:()=>{const{currentAnalysis:n}=s();return n?.balance.zoneDistribution||{}}}));function En(){const{currentDeck:t}=z(),{currentAnalysis:s,isAnalyzing:n,analyzeDeck:r,getBalanceScore:a,getSuggestionsBy:i,getZoneDistribution:o}=Rn();if(y.useEffect(()=>{t&&r(t)},[t,r]),!t)return e.jsx("div",{className:"p-8 text-center",children:e.jsxs("div",{className:"text-gray-500",children:[e.jsx("div",{className:"text-4xl mb-4",children:"📊"}),e.jsx("h3",{className:"text-lg font-medium mb-2",children:"No deck selected"}),e.jsx("p",{children:"Select or create a deck to view analytics"})]})});if(n)return e.jsxs("div",{className:"p-8 text-center",children:[e.jsx("span",{className:"loading loading-spinner loading-lg"}),e.jsx("p",{className:"mt-4 text-gray-600",children:"Analyzing deck balance..."})]});if(!s)return e.jsx("div",{className:"p-8 text-center",children:e.jsxs("div",{className:"text-gray-500",children:[e.jsx("div",{className:"text-4xl mb-4",children:"⚠️"}),e.jsx("h3",{className:"text-lg font-medium mb-2",children:"Analysis failed"}),e.jsx("p",{children:"Unable to analyze deck. Please try again."})]})});const l=s.balance,c=a(),d=o(),m=i(void 0,"high"),g=i(void 0,"medium");return e.jsxs("div",{className:"p-6 space-y-6",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs("div",{children:[e.jsx("h2",{className:"text-2xl font-bold",children:"Deck Analytics"}),e.jsx("p",{className:"text-gray-600",children:t.name})]}),e.jsxs("button",{className:"btn btn-outline btn-sm",onClick:()=>r(t),disabled:n,children:[n?e.jsx("span",{className:"loading loading-spinner loading-sm"}):"🔄","Refresh"]})]}),e.jsx("div",{className:"card bg-base-100 shadow-sm",children:e.jsxs("div",{className:"card-body",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs("div",{children:[e.jsx("h3",{className:"text-lg font-semibold",children:"Overall Balance"}),e.jsx("p",{className:"text-sm text-gray-600",children:c>=8?"Excellent":c>=6?"Good":c>=4?"Fair":"Needs Improvement"})]}),e.jsxs("div",{className:"text-right",children:[e.jsx("div",{className:"text-3xl font-bold text-primary",children:c.toFixed(1)}),e.jsx("div",{className:"text-sm text-gray-500",children:"out of 10"})]})]}),e.jsxs("div",{className:"mt-4",children:[e.jsxs("div",{className:"flex justify-between text-sm mb-1",children:[e.jsx("span",{children:"Balance Score"}),e.jsxs("span",{children:[c.toFixed(1),"/10"]})]}),e.jsx("progress",{className:`progress w-full ${c>=8?"progress-success":c>=6?"progress-info":c>=4?"progress-warning":"progress-error"}`,value:c,max:"10"})]})]})}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-4",children:[e.jsx("div",{className:"card bg-base-100 shadow-sm",children:e.jsxs("div",{className:"card-body text-center",children:[e.jsx("div",{className:"text-2xl",children:"🃏"}),e.jsx("div",{className:"stat-value text-2xl",children:l.cardCount}),e.jsx("div",{className:"stat-title",children:"Total Cards"})]})}),e.jsx("div",{className:"card bg-base-100 shadow-sm",children:e.jsxs("div",{className:"card-body text-center",children:[e.jsx("div",{className:"text-2xl",children:"👥"}),e.jsx("div",{className:"stat-value text-2xl",children:l.recommendedPlayerCount.length>1?`${l.recommendedPlayerCount[0]}-${l.recommendedPlayerCount[l.recommendedPlayerCount.length-1]}`:l.recommendedPlayerCount[0]}),e.jsx("div",{className:"stat-title",children:"Players"})]})}),e.jsx("div",{className:"card bg-base-100 shadow-sm",children:e.jsxs("div",{className:"card-body text-center",children:[e.jsx("div",{className:"text-2xl",children:l.difficulty==="beginner"?"🟢":l.difficulty==="intermediate"?"🟡":"🔴"}),e.jsx("div",{className:"stat-value text-lg capitalize",children:l.difficulty}),e.jsx("div",{className:"stat-title",children:"Difficulty"})]})})]}),e.jsx("div",{className:"card bg-base-100 shadow-sm",children:e.jsxs("div",{className:"card-body",children:[e.jsx("h3",{className:"text-lg font-semibold mb-4",children:"Zone Distribution"}),e.jsx("div",{className:"space-y-3",children:Object.entries(d).map(([h,C])=>{const j=t.zoneTypes.find(x=>x.id===h),N=j?.name||h,u=C>=15&&C<=40,b=C>50;return e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs("div",{className:"flex items-center space-x-3",children:[e.jsx("div",{className:"w-4 h-4 rounded-full",style:{backgroundColor:j?.color||"#gray"}}),e.jsx("span",{className:"font-medium",children:N}),b&&e.jsx("span",{className:"badge badge-warning badge-xs",children:"Dominant"}),u&&e.jsx("span",{className:"badge badge-success badge-xs",children:"Balanced"})]}),e.jsxs("div",{className:"flex items-center space-x-2",children:[e.jsxs("span",{className:"text-sm font-medium",children:[C,"%"]}),e.jsx("div",{className:"w-20 bg-base-200 rounded-full h-2",children:e.jsx("div",{className:"bg-primary h-2 rounded-full",style:{width:`${C}%`}})})]})]},h)})})]})}),e.jsx("div",{className:"card bg-base-100 shadow-sm",children:e.jsxs("div",{className:"card-body",children:[e.jsx("h3",{className:"text-lg font-semibold mb-4",children:"Road Complexity"}),e.jsxs("div",{className:"grid grid-cols-3 gap-4 text-center",children:[e.jsxs("div",{children:[e.jsxs("div",{className:"text-2xl font-bold text-success",children:[l.roadComplexity.simple,"%"]}),e.jsx("div",{className:"text-sm text-gray-600",children:"Simple"})]}),e.jsxs("div",{children:[e.jsxs("div",{className:"text-2xl font-bold text-warning",children:[l.roadComplexity.medium,"%"]}),e.jsx("div",{className:"text-sm text-gray-600",children:"Medium"})]}),e.jsxs("div",{children:[e.jsxs("div",{className:"text-2xl font-bold text-error",children:[l.roadComplexity.complex,"%"]}),e.jsx("div",{className:"text-sm text-gray-600",children:"Complex"})]})]})]})}),l.scoringPotential.max>0&&e.jsx("div",{className:"card bg-base-100 shadow-sm",children:e.jsxs("div",{className:"card-body",children:[e.jsx("h3",{className:"text-lg font-semibold mb-4",children:"Scoring Potential"}),e.jsxs("div",{className:"grid grid-cols-3 gap-4 text-center",children:[e.jsxs("div",{children:[e.jsx("div",{className:"text-xl font-bold text-info",children:l.scoringPotential.min}),e.jsx("div",{className:"text-sm text-gray-600",children:"Minimum"})]}),e.jsxs("div",{children:[e.jsx("div",{className:"text-xl font-bold text-success",children:l.scoringPotential.average}),e.jsx("div",{className:"text-sm text-gray-600",children:"Average"})]}),e.jsxs("div",{children:[e.jsx("div",{className:"text-xl font-bold text-warning",children:l.scoringPotential.max}),e.jsx("div",{className:"text-sm text-gray-600",children:"Maximum"})]})]})]})}),(m.length>0||g.length>0)&&e.jsx("div",{className:"card bg-base-100 shadow-sm",children:e.jsxs("div",{className:"card-body",children:[e.jsx("h3",{className:"text-lg font-semibold mb-4",children:"Recommendations"}),m.length>0&&e.jsxs("div",{className:"mb-4",children:[e.jsx("h4",{className:"font-medium text-error mb-2",children:"High Priority"}),e.jsx("div",{className:"space-y-2",children:m.map(h=>e.jsx(Se,{suggestion:h},h.id))})]}),g.length>0&&e.jsxs("div",{children:[e.jsx("h4",{className:"font-medium text-warning mb-2",children:"Medium Priority"}),e.jsx("div",{className:"space-y-2",children:g.map(h=>e.jsx(Se,{suggestion:h},h.id))})]})]})})]})}function Se({suggestion:t}){const s=()=>{switch(t.type){case"warning":return"⚠️";case"suggestion":return"💡";case"improvement":return"✨";default:return"📝"}};return e.jsx("div",{className:"alert alert-sm",children:e.jsxs("div",{className:"flex items-start space-x-2",children:[e.jsx("span",{className:"text-lg",children:s()}),e.jsxs("div",{className:"flex-1",children:[e.jsx("div",{className:"font-medium",children:t.title}),e.jsx("div",{className:"text-sm text-gray-600",children:t.description})]})]})})}class Mn{worker=null;requestId=0;pendingRequests=new Map;constructor(){this.initializeWorker()}initializeWorker(){try{this.worker=new Worker(new URL("/____opolis/assets/scoring-worker-B5KC3osZ.js",import.meta.url),{type:"module"}),this.worker.onmessage=this.handleWorkerMessage.bind(this),this.worker.onerror=this.handleWorkerError.bind(this)}catch(s){console.error("Failed to initialize scoring worker:",s)}}handleWorkerMessage(s){const{id:n,result:r,error:a}=s.data,i=this.pendingRequests.get(n);i&&(this.pendingRequests.delete(n),a?i.reject(new Error(a)):i.resolve(r))}handleWorkerError(s){console.error("Worker error:",s);for(const n of this.pendingRequests.values())n.reject(new Error("Worker error: "+s.message));this.pendingRequests.clear(),this.terminate(),setTimeout(()=>this.initializeWorker(),1e3)}async executeFormula(s,n){if(!this.worker)throw new Error("Worker not available");return new Promise((r,a)=>{const i=++this.requestId;this.pendingRequests.set(i,{resolve:r,reject:a});const o=setTimeout(()=>{this.pendingRequests.delete(i),a(new Error("Request timeout"))},200),l=r,c=a,d=g=>{clearTimeout(o),l(g)},m=g=>{clearTimeout(o),c(g)};this.pendingRequests.set(i,{resolve:d,reject:m}),this.worker.postMessage({id:i,formula:s,gameState:this.sanitizeGameState(n)})})}sanitizeGameState(s){return{board:s.board||[],players:s.players||[],currentPlayerIndex:s.currentPlayerIndex||0,deck:s.deck||[],gamePhase:s.gamePhase||"ended",topCard:s.topCard||null,turnCount:s.turnCount||0,scoring:{activeConditions:s.scoring?.activeConditions||[],targetScore:s.scoring?.targetScore||0}}}terminate(){this.worker&&(this.worker.terminate(),this.worker=null);for(const s of this.pendingRequests.values())s.reject(new Error("Worker terminated"));this.pendingRequests.clear()}}let Z=null;function Fe(t,s){return Z||(Z=new Mn),Z.executeFormula(t,s)}function Ie(){Z&&(Z.terminate(),Z=null)}typeof window<"u"&&window.addEventListener("beforeunload",Ie);const An=Object.freeze(Object.defineProperty({__proto__:null,executeScoringFormula:Fe,terminateSandbox:Ie},Symbol.toStringTag,{value:"Module"}));function ke(t,s){const n={sum:d=>d.reduce((m,g)=>m+g,0),max:d=>Math.max(...d),min:d=>Math.min(...d),count:(d,m)=>d.filter(m).length},r=Ge(t.board),a=Ue(t.board),i=Ve(t.board),o=(()=>{const d={};for(const m of i)d[m.y]||(d[m.y]={}),d[m.y][m.x]=m;return d})(),l={getAllTiles:()=>i,getTileAt:(d,m)=>o[d]?.[m]??null,getAdjacentTiles:(d,m)=>[{row:d-1,col:m},{row:d+1,col:m},{row:d,col:m-1},{row:d,col:m+1}].map(h=>o[h.row]?.[h.col]).filter(h=>h!==void 0),findClusters:(...d)=>{const m=Object.fromEntries(d.map(g=>[g,[]]));for(const g of r)m[g.type]&&m[g.type]?.push(g);return m},findLargestCluster:d=>r.reduce((m,g)=>g.type===d&&g.size>m.size?g:m,{type:"",size:0,tiles:[]}),countZonesOfType:d=>l.getAllTiles().filter(m=>m.type===d).length,findRoadNetworks:()=>a,getDistance:(d,m)=>{const g=d.x-m.x,h=d.y-m.y;return Math.sqrt(g*g+h*h)},isAdjacent:(d,m)=>{const g=Math.abs(d.x-m.x),h=Math.abs(d.y-m.y);return g===1&&h===0||g===0&&h===1},getTilesInRadius:(d,m)=>l.getAllTiles().filter(g=>l.getDistance(d,g)<=m)};return{gameState:JSON.parse(JSON.stringify(t)),...n,...l,roads:a,tileMap:o,tiles:i}}function On(t,s){const n=Object.keys(s);return new Function(...n,`
    'use strict';
    ${t}

    // Execute the user's calculateScore function
    return calculateScore({ ${n.join(", ")} });
  `)(...Object.keys(s).map(a=>s[a]))}class ${static instance;static getInstance(){return $.instance||($.instance=new $),$.instance}async executeFormulaDirectly(s,n){console.log("🐛 DEBUG MODE: Executing formula directly"),console.log("📊 Game state:",n);const r=ke(n);console.log("🎯 All tiles:",r.getAllTiles());try{console.log("Compiled JS:",s),console.log("🔧 Executing formula...");const a=On(s,r);console.log("✅ Formula result:",a);const i={score:typeof a=="number"?a:a?.score||0,details:a?.details||[]};return console.log("📋 Normalized result:",i),i}catch(a){return console.error("❌ Formula execution error:",a),{score:0,details:[]}}}async testRule(s,n,r=!1){const a=performance.now();try{const i=ke({board:n,players:[],currentPlayerIndex:0,deck:[],gamePhase:"ended",topCard:null,turnCount:15});let o;r?o=await this.executeFormulaDirectly(s.compiledFormula,i.gameState):o=await Fe(s.compiledFormula,i.gameState);const l=performance.now(),c=this.generateTileHighlights(o,n);return{ruleId:s.id,testBoard:[...n],calculatedScore:o.score,highlightedTiles:c,executionTime:l-a,errors:[],details:o.details?{description:`${s.name}: ${o.score} points`,breakdown:o.details.map(d=>({description:d.description||"Scoring calculation",points:d.points||0,tiles:(d.relevantTiles||[]).map(m=>({row:m.y,col:m.x}))}))}:void 0}}catch(i){const o=performance.now();return{ruleId:s.id,testBoard:[...n],calculatedScore:0,highlightedTiles:[],executionTime:o-a,errors:[i instanceof Error?i.message:"Unknown error"]}}}createTestBoard(s,n=8){const r=[];let a=0;const i=()=>`test-card-${a++}`,o=Math.min(n,s.baseCards.reduce((c,d)=>c+d.count,0));let l=0;for(const c of s.baseCards){if(l>=o)break;const d=Math.min(c.count,o-l);for(let m=0;m<d;m++){const g=Math.ceil(Math.sqrt(o)),h=Math.floor(l/g),C=l%g;r.push({id:i(),x:C*3,y:h*3,cells:c.cells,rotation:0}),l++}}return r}placeCard(s,n,r){const a={id:`placed-${Date.now()}-${Math.random()}`,x:n.x,y:n.y,cells:r.cells,rotation:0},i=s.findIndex(o=>Math.abs(o.x-n.x)<2&&Math.abs(o.y-n.y)<2);if(i>=0){const o=[...s];return o[i]=a,o}else return[...s,a]}removeCard(s,n){return s.filter(r=>!(Math.abs(r.x-n.x)<2&&Math.abs(r.y-n.y)<2))}generateTileHighlights(s,n){const r=[];return s.highlightedTiles&&s.highlightedTiles.forEach(a=>{r.push({row:a.row,col:a.col,color:a.color||"#3b82f6",intensity:a.intensity||.7,description:a.description})}),r.length===0&&s.details&&s.details.forEach(a=>{a.tiles&&a.tiles.forEach(i=>{r.push({row:i.row,col:i.col,color:a.points>0?"#10b981":"#ef4444",intensity:Math.min(1,Math.abs(a.points)/10),description:a.description})})}),r}getCommonPresets(s){const n=[];if(n.push({id:"empty",name:"Empty Board",description:"Start with a clean slate",board:[],suggestedRules:[]}),s.baseCards.length>0){const r=s.baseCards[0];n.push({id:"single-card",name:"Single Card",description:"Test with one card",board:[{id:"preset-single",x:0,y:0,cells:r.cells,rotation:0}],suggestedRules:[]})}if(s.baseCards.length>=4){const r=[];for(let a=0;a<Math.min(4,s.baseCards.length);a++){const i=s.baseCards[a];r.push({id:`preset-cluster-${a}`,x:a%2*3,y:Math.floor(a/2)*3,cells:i.cells,rotation:0})}n.push({id:"small-cluster",name:"Small Cluster",description:"Four cards in a cluster",board:r,suggestedRules:s.customScoringConditions?.map(a=>a.id)||[]})}return n.push({id:"full-board",name:"Full Test Board",description:"Generated board with variety of cards",board:this.createTestBoard(s,8),suggestedRules:s.customScoringConditions?.map(r=>r.id)||[]}),n}getBoardStats(s,n){const r={cardCount:s.length,zoneCount:{},roadConnections:0,coverage:0};n.zoneTypes.forEach(o=>{r.zoneCount[o.id]=0});let a=0;s.forEach(o=>{o.cells.forEach(l=>{l.forEach(c=>{r.zoneCount[c.type]=(r.zoneCount[c.type]||0)+1,a++,c.roads&&c.roads.length>0&&(r.roadConnections+=c.roads.length)})})});const i=32;return r.coverage=a>0?Math.round(a/i*100):0,r}}const zn=$.getInstance(),Ln=Ze({actions:{setVariations:M({selectedVariations:({event:t})=>t.type==="SET_VARIATIONS"?t.variations:[]}),setExpansions:M({selectedExpansions:({event:t})=>t.type==="SET_EXPANSIONS"?t.expansions:[]}),setPlayerCount:M({playerCount:({event:t})=>t.type==="SET_PLAYER_COUNT"?t.count:2}),setGameState:M({gameState:({event:t})=>"output"in t?t.output:null,error:null}),selectCard:M({selectedCard:({event:t})=>t.type==="SELECT_CARD"?t.card:null,cardRotation:0,error:null}),rotateSelectedCard:M({cardRotation:({context:t})=>t.cardRotation===0?180:0}),setPlacementPosition:M({placementPos:({event:t})=>t.type==="PLACE_CARD"?{x:t.x,y:t.y}:{x:0,y:0}}),resetGame:M({gameState:null,selectedCard:null,cardRotation:0,placementPos:{x:0,y:0},error:null}),setError:M({error:({event:t})=>"error"in t?String(t.error):"An error occurred"}),clearError:M({error:null}),checkGameOver:({context:t,self:s})=>{if(!t.gameState)return;const n=t.gameState.deck.length===0,r=t.gameState.players.every(a=>a.hand.length===0);n&&r&&s.send({type:"GAME_OVER_DETECTED"})},loadDeck:M({currentDeck:({event:t})=>t.type==="LOAD_DECK"?t.deck:null,selectedVariations:({event:t})=>t.type==="LOAD_DECK"?[t.deck]:[],gameState:({event:t})=>t.type==="LOAD_DECK"?{players:[{id:"test-player",name:"Test Player",hand:[],isActive:!0}],currentPlayerIndex:0,deck:[],board:[],topCard:null,gamePhase:"playing",turnCount:1,scoring:{activeConditions:[],targetScore:0}}:null,error:null}),loadRule:M({currentRule:({event:t})=>t.type==="LOAD_RULE"?t.rule:null,scoringResults:null,error:null}),selectCardDef:M({selectedCardDef:({event:t})=>t.type==="SELECT_CARD_DEF"?t.cardDef:null,selectedCard:({event:t})=>t.type==="SELECT_CARD_DEF"?{id:`test-${Date.now()}`,x:0,y:0,cells:t.cardDef.cells,rotation:0}:null,cardRotation:0,error:null}),clearSelection:M({selectedCard:null,selectedCardDef:null,cardRotation:0}),setDebugMode:M({debugMode:({event:t})=>t.type==="SET_DEBUG_MODE"?t.debugMode:!1}),recreateSelectedCard:M({selectedCard:({context:t})=>t.selectedCardDef?{id:`test-${Date.now()}`,x:0,y:0,cells:t.selectedCardDef.cells,rotation:0}:null,cardRotation:0}),updateGameState:M({gameState:({event:t})=>"output"in t?t.output:null,selectedCard:null,cardRotation:0}),setScoringResults:M({scoringResults:({event:t})=>"output"in t?t.output:null,isLoading:!1,error:null}),setLoading:M({isLoading:!0})},guards:{hasValidSetup:({context:t})=>t.selectedVariations.length>0&&t.playerCount>=2,hasSelectedCard:({context:t})=>t.selectedCard!==null,isGameOver:({context:t})=>{if(!t.gameState)return!1;const s=t.gameState.deck.length===0,n=t.gameState.players.every(r=>r.hand.length===0);return s&&n},hasCurrentDeck:({context:t})=>t.currentDeck!==null,hasCurrentRule:({context:t})=>t.currentRule!==null,canRunTest:({context:t})=>t.currentRule!==null&&t.gameState!==null&&t.gameState.board.length>0},actors:{initializeGame:K(async({input:t})=>{const s=Array.from({length:t.playerCount},(r,a)=>`Player ${a+1}`),{initializeGame:n}=await ee(async()=>{const{initializeGame:r}=await import("./chunk-BgFcsJyw.js").then(a=>a.l);return{initializeGame:r}},__vite__mapDeps([0,1,2,3,4,5,6,7]));return n(s,t.selectedVariations,t.selectedExpansions)}),placeCard:K(async({input:t})=>{const{gameState:s,selectedCard:n,cardRotation:r,placementPos:a}=t;if(!s||!n)throw new Error("Invalid game state for placing card");const{rotateCard:i,isValidPlacement:o}=await ee(async()=>{const{rotateCard:m,isValidPlacement:g}=await import("./chunk-BgFcsJyw.js").then(h=>h.l);return{rotateCard:m,isValidPlacement:g}},__vite__mapDeps([0,1,2,3,4,5,6,7])),l=r>0?i(n,r):n;if(!o(l,a.x,a.y,s.board))throw new Error("Invalid card placement");const c={...l,x:a.x,y:a.y};return{...s,board:[...s.board,c]}}),removeCard:K(async({input:t})=>{const{gameState:s,position:n}=t;if(!s)throw new Error("Invalid game state for removing card");const r=s.board.filter(a=>!(Math.abs(a.x-n.x)<2&&Math.abs(a.y-n.y)<2));return{...s,board:r}}),runTest:K(async({input:t})=>{const{rule:s,board:n,debugMode:r}=t;return zn.testRule(s,n,r)})}}).createMachine({id:"rule-test",context:{selectedVariations:[],selectedExpansions:[],playerCount:1,gameState:null,selectedCard:null,cardRotation:0,placementPos:{x:0,y:0},error:null,currentDeck:null,currentRule:null,selectedCardDef:null,scoringResults:null,isLoading:!1,debugMode:!1},initial:"ruleTestSetup",states:{ruleTestSetup:{on:{LOAD_DECK:{target:"playing.idle",actions:"loadDeck"}}},playing:{initial:"idle",states:{idle:{on:{LOAD_RULE:{actions:"loadRule"},SELECT_CARD_DEF:{target:"cardSelected",actions:"selectCardDef",guard:"hasCurrentDeck"},RUN_TEST:{target:"testing",guard:"canRunTest"},REMOVE_CARD:{target:"removingCard"},SELECT_CARD:{target:"cardSelected",actions:"selectCard"},CLEAR_SELECTION:{actions:"clearSelection"}}},cardSelected:{on:{SELECT_CARD_DEF:{actions:"selectCardDef",guard:"hasCurrentDeck"},SELECT_CARD:{actions:"selectCard"},ROTATE_CARD:{actions:"rotateSelectedCard"},PLACE_CARD:{target:"placing",actions:"setPlacementPosition",guard:"hasSelectedCard"},CANCEL_PLACEMENT:{target:"idle",actions:"clearSelection"}}},placing:{invoke:{src:"placeCard",input:({context:t})=>({gameState:t.gameState,selectedCard:t.selectedCard,cardRotation:t.cardRotation,placementPos:t.placementPos}),onDone:[{target:"testing",actions:"updateGameState",guard:"canRunTest"},{target:"cardSelected",actions:["updateGameState","recreateSelectedCard"]}],onError:{target:"cardSelected",actions:"setError"}}},removingCard:{invoke:{src:"removeCard",input:({context:t,event:s})=>({gameState:t.gameState,position:s.type==="REMOVE_CARD"?{x:s.x,y:s.y}:{x:0,y:0}}),onDone:{target:"testing",actions:"updateGameState"},onError:{target:"idle",actions:"setError"}}},testing:{entry:"setLoading",invoke:{src:"runTest",input:({context:t})=>({rule:t.currentRule,board:t.gameState.board,debugMode:t.debugMode}),onDone:[{target:"cardSelected",actions:["setScoringResults","recreateSelectedCard"],guard:({context:t})=>t.selectedCardDef!==null},{target:"idle",actions:"setScoringResults"}],onError:{target:"idle",actions:"setError"}}}}}},on:{CLEAR_ERROR:{actions:"clearError"},SET_DEBUG_MODE:{actions:"setDebugMode"}}}),pe=He(Ln),Pn=()=>{const t=pe.useActorRef(),s=pe.useSelector(a=>a);return{selectors:{currentDeck:s.context.currentDeck,currentRule:s.context.currentRule,selectedCardDef:s.context.selectedCardDef,scoringResults:s.context.scoringResults,isLoading:s.context.isLoading,debugMode:s.context.debugMode,gameState:s.context.gameState,selectedCard:s.context.selectedCard,cardRotation:s.context.cardRotation,selectedVariations:s.context.selectedVariations,error:s.context.error,board:s.context.gameState?.board||[]},actions:{loadDeck:a=>{a&&t.send({type:"LOAD_DECK",deck:a})},loadRule:a=>t.send({type:"LOAD_RULE",rule:a}),selectCardDef:a=>t.send({type:"SELECT_CARD_DEF",cardDef:a}),removeCard:(a,i)=>t.send({type:"REMOVE_CARD",x:a,y:i}),resetBoard:()=>t.send({type:"RESET_BOARD"}),generateFullDeck:()=>t.send({type:"GENERATE_FULL_DECK"}),loadPreset:a=>t.send({type:"LOAD_PRESET",preset:a}),runTest:()=>t.send({type:"RUN_TEST"}),setDebugMode:a=>t.send({type:"SET_DEBUG_MODE",debugMode:a}),placeCard:(a,i)=>t.send({type:"PLACE_CARD",x:a,y:i}),rotateCard:()=>t.send({type:"ROTATE_CARD"}),clearSelection:()=>t.send({type:"CLEAR_SELECTION"}),clearError:()=>t.send({type:"CLEAR_ERROR"})}}},_n=pe.Provider;function Fn(){const{currentDeck:t}=z(),s=Pn(),{selectors:n,actions:r}=s,{currentRule:a,gameState:i,selectedCardDef:o,scoringResults:l,isLoading:c,board:d,debugMode:m}=n,{loadDeck:g,loadRule:h,selectCardDef:C,placeCard:j,removeCard:N,resetBoard:u,generateFullDeck:b,loadPreset:x,clearSelection:p,setDebugMode:w}=r,v=$.getInstance();if(y.useEffect(()=>{t&&g(t)},[t,g]),!t)return e.jsx("div",{className:"p-8 text-center",children:e.jsxs("div",{className:"text-gray-500",children:[e.jsx("div",{className:"text-4xl mb-4",children:"🧪"}),e.jsx("h3",{className:"text-lg font-medium mb-2",children:"No deck selected"}),e.jsx("p",{children:"Select or create a deck to test scoring rules"})]})});const S=i?v.getBoardStats(d,t):{cardCount:0,zoneCount:{},roadConnections:0,coverage:0},k=t?v.getCommonPresets(t):[],T=t?.customScoringConditions||[],R=(f,D)=>{o?j(f,D):N(f,D)};return e.jsxs("div",{className:"p-6 space-y-6",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs("div",{children:[e.jsx("h2",{className:"text-2xl font-bold",children:"Rule Testing"}),e.jsx("p",{className:"text-gray-600",children:t.name})]}),e.jsxs("div",{className:"flex space-x-2",children:[e.jsx("div",{className:"form-control",children:e.jsxs("label",{className:"label cursor-pointer",children:[e.jsx("span",{className:"label-text mr-2 text-sm",children:"🐛 Debug Mode"}),e.jsx("input",{type:"checkbox",className:"toggle toggle-primary toggle-sm",checked:m,onChange:f=>w(f.target.checked),title:"Enable debug mode to see console.log output from scoring rules (slower execution)"})]})}),e.jsx("button",{className:"btn btn-outline btn-sm",onClick:b,disabled:c,children:"🔄 Regenerate Board"}),e.jsx("button",{className:"btn btn-outline btn-sm",onClick:u,children:"🗑️ Clear Board"})]})]}),e.jsx("div",{className:"card bg-base-100 shadow-sm",children:e.jsxs("div",{className:"card-body",children:[e.jsx("h3",{className:"text-lg font-semibold mb-4",children:"Select Scoring Rule"}),T.length===0?e.jsxs("div",{className:"text-center py-4",children:[e.jsx("div",{className:"text-gray-500 mb-2",children:"No custom scoring rules found"}),e.jsx("p",{className:"text-sm text-gray-400",children:"Create some scoring rules to test them here"})]}):e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3",children:[e.jsx("button",{className:`btn ${a?"btn-outline":"btn-primary"}`,onClick:()=>h(null),children:"No Rule Selected"}),T.map(f=>e.jsx("button",{className:`btn ${a?.id===f.id?"btn-primary":"btn-outline"}`,onClick:()=>h(f),children:f.name},f.id))]})]})}),a&&e.jsx("div",{className:"card bg-base-100 shadow-sm",children:e.jsxs("div",{className:"card-body",children:[e.jsxs("div",{className:"flex items-start justify-between",children:[e.jsxs("div",{children:[e.jsx("h3",{className:"text-lg font-semibold",children:a.name}),e.jsx("p",{className:"text-gray-600 text-sm",children:a.description}),e.jsxs("p",{className:"text-xs text-gray-500 mt-1",children:["Target: ",a.targetContribution," points"]})]}),e.jsxs("div",{className:"text-right",children:[l&&e.jsxs("div",{children:[e.jsx("div",{className:"text-2xl font-bold text-primary",children:l.calculatedScore}),e.jsx("div",{className:"text-sm text-gray-500",children:"points"}),e.jsxs("div",{className:"text-xs text-gray-400",children:[l.executionTime.toFixed(1),"ms"]})]}),c&&e.jsx("span",{className:"loading loading-spinner loading-md"})]})]}),l?.errors&&l.errors.length>0&&e.jsx("div",{className:"mt-4 alert alert-error",children:e.jsxs("div",{children:[e.jsx("h4",{className:"font-medium",children:"Execution Errors:"}),e.jsx("ul",{className:"list-disc list-inside text-sm",children:l.errors.map((f,D)=>e.jsx("li",{children:f},D))})]})})]})}),e.jsxs("div",{className:"grid grid-cols-1 lg:grid-cols-3 gap-6",children:[e.jsxs("div",{className:"lg:col-span-1 space-y-4",children:[e.jsx("div",{className:"card bg-base-100 shadow-sm",children:e.jsxs("div",{className:"card-body",children:[e.jsx("h3",{className:"text-lg font-semibold mb-4",children:"Card Palette"}),e.jsxs("div",{className:"space-y-2",children:[e.jsx("button",{className:`btn btn-block ${o?"btn-outline":"btn-primary"}`,onClick:p,children:"🗑️ Remove Cards"}),t.baseCards.map(f=>e.jsx("button",{className:`btn btn-block text-left ${o?.id===f.id?"btn-primary":"btn-outline"}`,onClick:()=>C(f),children:e.jsxs("div",{className:"flex items-center justify-between w-full",children:[e.jsx("span",{children:f.name||`Card ${f.id.slice(-4)}`}),e.jsx("span",{className:"badge badge-sm",children:f.count})]})},f.id))]})]})}),e.jsx("div",{className:"card bg-base-100 shadow-sm",children:e.jsxs("div",{className:"card-body",children:[e.jsx("h3",{className:"text-lg font-semibold mb-4",children:"Board Presets"}),e.jsx("div",{className:"space-y-2",children:k.map(f=>e.jsx("button",{className:"btn btn-outline btn-block text-left",onClick:()=>x(f),children:e.jsxs("div",{children:[e.jsx("div",{className:"font-medium",children:f.name}),e.jsx("div",{className:"text-xs text-gray-500",children:f.description})]})},f.id))})]})}),e.jsx("div",{className:"card bg-base-100 shadow-sm",children:e.jsxs("div",{className:"card-body",children:[e.jsx("h3",{className:"text-lg font-semibold mb-4",children:"Board Stats"}),e.jsxs("div",{className:"space-y-3",children:[e.jsxs("div",{className:"flex justify-between",children:[e.jsx("span",{children:"Cards:"}),e.jsx("span",{className:"font-medium",children:S.cardCount})]}),e.jsxs("div",{className:"flex justify-between",children:[e.jsx("span",{children:"Roads:"}),e.jsx("span",{className:"font-medium",children:S.roadConnections})]}),e.jsxs("div",{className:"flex justify-between",children:[e.jsx("span",{children:"Coverage:"}),e.jsxs("span",{className:"font-medium",children:[S.coverage,"%"]})]}),e.jsx("div",{className:"divider my-2"}),e.jsxs("div",{className:"text-sm",children:[e.jsx("div",{className:"font-medium mb-2",children:"Zones:"}),Object.entries(S.zoneCount).map(([f,D])=>{const L=t.zoneTypes.find(_=>_.id===f);return D===0?null:e.jsxs("div",{className:"flex justify-between items-center",children:[e.jsxs("div",{className:"flex items-center space-x-2",children:[e.jsx("div",{className:"w-3 h-3 rounded-full",style:{backgroundColor:L?.color||"#gray"}}),e.jsx("span",{children:L?.name||f})]}),e.jsx("span",{children:D})]},f)})]})]})]})})]}),e.jsx("div",{className:"lg:col-span-2",children:e.jsx("div",{className:"card bg-base-100 shadow-sm",children:e.jsxs("div",{className:"card-body",children:[e.jsxs("div",{className:"flex items-center justify-between mb-4",children:[e.jsx("h3",{className:"text-lg font-semibold",children:"Test Board"}),e.jsx("div",{className:"text-sm text-gray-500",children:o?"Click to place card":"Select card type to place, or click cards to remove"})]}),e.jsx("div",{className:"relative bg-gray-800 rounded border",style:{width:"600px",height:"400px"},children:i&&e.jsx(We,{gameState:i,onCardPlace:R,machine:s,width:600,height:400})}),l?.details&&e.jsxs("div",{className:"mt-4",children:[e.jsx("h4",{className:"font-medium mb-2",children:"Scoring Details:"}),e.jsx("div",{className:"text-sm text-gray-600",children:l.details.description}),l.details.breakdown.length>0&&e.jsx("div",{className:"mt-2 space-y-1",children:l.details.breakdown.map((f,D)=>e.jsxs("div",{className:"flex justify-between text-sm",children:[e.jsx("span",{children:f.description}),e.jsx("span",{className:"font-medium",children:f.points})]},D))})]})]})})})]})]})}const In=ne()((t,s)=>({currentSchema:null,validationErrors:[],isEditingSchema:!1,setSchema:n=>{const r=U(n.fields);t({currentSchema:n,validationErrors:r})},updateSchema:n=>{const r={fields:n,version:"1.0.0"},a=U(n);t({currentSchema:r,validationErrors:a})},addField:n=>{const{currentSchema:r}=s(),i=[...r?.fields||[],n],o=U(i);t({currentSchema:{fields:i,version:r?.version||"1.0.0"},validationErrors:o})},updateField:(n,r)=>{const{currentSchema:a}=s();if(!a)return;const i=a.fields.map(l=>l.id===n?{...l,...r}:l),o=U(i);t({currentSchema:{...a,fields:i},validationErrors:o})},removeField:n=>{const{currentSchema:r}=s();if(!r)return;const a=r.fields.filter(o=>o.id!==n),i=U(a);t({currentSchema:{...r,fields:a},validationErrors:i})},validateSchema:()=>{const{currentSchema:n}=s();if(!n)return[];const r=U(n.fields);return t({validationErrors:r}),r},clearSchema:()=>{t({currentSchema:null,validationErrors:[]})},setEditingSchema:n=>{t({isEditingSchema:n})},getFieldById:n=>{const{currentSchema:r}=s();return r?.fields.find(a=>a.id===n)},generateFieldId:n=>{const{currentSchema:r}=s(),a=new Set(r?.fields.map(c=>c.id)||[]);let i=n.toLowerCase().replace(/[^a-z0-9\s]/g,"").replace(/\s+/g," ").trim().split(" ").map((c,d)=>d===0?c:c.charAt(0).toUpperCase()+c.slice(1)).join("");i||(i="field"),/^[a-zA-Z]/.test(i)||(i="field"+i.charAt(0).toUpperCase()+i.slice(1));let o=1,l=i;for(;a.has(l);)l=`${i}${o}`,o++;return l}}));function Bn(){const t=[];t.push("// TypeScript definitions for Metadata Rendering"),t.push("// Provides IntelliSense for canvas-based metadata rendering"),t.push("");let s=_e;return s=s.replace(/^import\s+.*?;?\s*$/gm,""),s=s.replace(/^export\s+/gm,"declare "),s=s.replace(/^interface\s/gm,"declare interface "),s=s.replace(/^type\s/gm,"declare type "),s=s.replace(/^function\s/gm,"declare function "),s=s.replace(/^declare\s+declare\s+/gm,"declare "),s=s.trim(),s&&t.push(s),t.join(`
`)}const $n=`/**
 * Render metadata on the card using Canvas 2D API
 * 
 * @param context - Rendering context with canvas and metadata
 * 
 * Available context properties:
 * - context.canvas: Your own 60x40 canvas element to draw on (3:2 aspect ratio)
 * - context.ctx: 2D rendering context for the canvas  
 * - context.metadata: All metadata values for this zone
 * - context.field: The current field definition
 * - context.zone: Zone data (type, roads, etc.)
 * - context.zonePosition: Position {row, col} in the card grid
 * - context.cellWidth, context.cellHeight: Actual zone dimensions
 * 
 * Coordinate system: 60x40 pixels (0,0 = top-left, 60,40 = bottom-right)
 */
function renderMetadata(context: MetadataRenderContext) {
  const { metadata, field, ctx } = context;
  const fieldValue = metadata[field.id];
  
  // Example: Display the field value as text in the top-left corner
  if (fieldValue !== undefined && fieldValue !== null && fieldValue !== '') {
    ctx.fillStyle = '#333';
    ctx.font = 'bold 8px Arial';
    ctx.fillText(String(fieldValue), 3, 12);
  }
  
  // Example: Draw a colored badge with number in top-right corner
  // ctx.fillStyle = '#ff6b35';
  // ctx.beginPath();
  // ctx.arc(54, 6, 5, 0, 2 * Math.PI); // Circle at (54,6) with radius 5
  // ctx.fill();
  // 
  // ctx.fillStyle = 'white';
  // ctx.font = 'bold 6px Arial';
  // ctx.textAlign = 'center';
  // ctx.fillText(String(fieldValue), 54, 9);
}`;function Gn({field:t,onChange:s}){const[n,r]=y.useState(t.renderFormula||$n),[a,i]=y.useState([]),[o,l]=y.useState(!1),c=y.useRef(null);y.useEffect(()=>{const C=setTimeout(async()=>{if(n.trim()){l(!0);try{const j=await qe(n);j.success?(i([]),s({renderFormula:n,compiledRenderFormula:j.compiled})):i(j.diagnostics||[j.error||"Compilation failed"])}catch(j){i([j instanceof Error?j.message:"Unknown error"])}finally{l(!1)}}},1e3);return()=>clearTimeout(C)},[n,s]);const d=(h,C)=>{c.current=h,C.languages.typescript.typescriptDefaults.addExtraLib(Bn(),"metadata-rendering-api.d.ts"),C.languages.typescript.typescriptDefaults.setCompilerOptions({target:C.languages.typescript.ScriptTarget.ES2020,allowNonTsExtensions:!0,moduleResolution:C.languages.typescript.ModuleResolutionKind.NodeJs,module:C.languages.typescript.ModuleKind.CommonJS,noEmit:!0,strict:!0,noImplicitAny:!0,strictNullChecks:!0,strictFunctionTypes:!0,noImplicitReturns:!0,noUnusedLocals:!1,noUnusedParameters:!1,esModuleInterop:!0});const j=h.getModel();if(j){const N=()=>{const b=C.editor.getModelMarkers({resource:j.uri}).filter(x=>x.severity>=8).map(x=>`Line ${x.startLineNumber}: ${x.message}`);(b.length!==a.length||!b.every((x,p)=>x===a[p]))&&i(b)};C.editor.onDidChangeMarkers(()=>N()),setTimeout(N,500)}},m=h=>{h!==void 0&&r(h)},g=h=>{s({renderOnCard:h})};return e.jsxs("div",{className:"space-y-4",children:[e.jsx("div",{className:"form-control",children:e.jsxs("label",{className:"label cursor-pointer",children:[e.jsxs("span",{className:"label-text",children:["Show this field on cards",e.jsx("div",{className:"text-xs text-gray-500 mt-1",children:"When enabled, the render formula below will be executed to display this field on cards"})]}),e.jsx("input",{type:"checkbox",className:"checkbox checkbox-primary",checked:t.renderOnCard||!1,onChange:h=>g(h.target.checked)})]})}),t.renderOnCard&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx("h4",{className:"text-sm font-medium",children:"Render Formula"}),e.jsxs("div",{className:"flex items-center space-x-2",children:[o&&e.jsxs("div",{className:"flex items-center space-x-1 text-sm text-gray-500",children:[e.jsx("span",{className:"loading loading-spinner loading-xs"}),e.jsx("span",{children:"Compiling..."})]}),!o&&a.length===0&&e.jsxs("div",{className:"flex items-center space-x-1 text-sm text-green-600",children:[e.jsx("span",{children:"✓"}),e.jsx("span",{children:"Ready"})]}),!o&&a.length>0&&e.jsxs("div",{className:"flex items-center space-x-1 text-sm text-red-600",children:[e.jsx("span",{children:"✗"}),e.jsxs("span",{children:[a.length," error",a.length===1?"":"s"]})]})]})]}),e.jsx("div",{className:"border rounded-lg overflow-hidden",children:e.jsx(Pe,{height:"300px",language:"typescript",value:n,onChange:m,onMount:d,options:{readOnly:!1,minimap:{enabled:!1},scrollBeyondLastLine:!1,fontSize:13,fontFamily:'Monaco, Menlo, "Ubuntu Mono", monospace',tabSize:2,insertSpaces:!0,renderWhitespace:"selection",lineNumbers:"on",glyphMargin:!1,folding:!1,contextmenu:!1,automaticLayout:!0}})}),a.length>0&&e.jsx("div",{className:"alert alert-error",children:e.jsxs("div",{children:[e.jsx("h4",{className:"font-medium",children:"Compilation Errors:"}),e.jsx("ul",{className:"list-disc list-inside text-sm mt-1",children:a.map((h,C)=>e.jsx("li",{children:h},C))})]})})]})]})}function Un({isOpen:t,field:s,onSave:n,onClose:r,generateFieldId:a}){const[i,o]=y.useState({name:"",type:"text",description:"",required:!1,renderOnCard:!1}),[l,c]=y.useState("basic"),[d,m]=y.useState([]);if(y.useEffect(()=>{t&&(s?(o({...s}),s.renderFormula&&c("rendering")):(o({name:"",type:"text",description:"",required:!1,renderOnCard:!1}),c("basic")),m([]))},[t,s]),!t)return null;const g=!!s,h=()=>{const u=[];return i.name?.trim()||u.push("Field name is required"),i.type||u.push("Field type is required"),m(u),u.length===0},C=()=>{if(!h())return;const u={id:s?.id||a(i.name),name:i.name,type:i.type||"text",description:i.description,required:i.required||!1,renderOnCard:i.renderOnCard||!1,renderFormula:i.renderFormula,compiledRenderFormula:i.compiledRenderFormula,...i.type==="select"&&{options:i.options||["Option 1","Option 2"]},...i.type==="number"&&{min:i.min??0,max:i.max??100}};n(u),r()},j=()=>{r()},N=u=>{o(b=>({...b,...u}))};return e.jsx("div",{className:"fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50",children:e.jsxs("div",{className:"bg-white rounded-lg shadow-xl w-full h-full max-w-6xl max-h-[90vh] overflow-hidden",children:[e.jsxs("div",{className:"flex items-center justify-between p-6 border-b bg-gray-50",children:[e.jsxs("div",{children:[e.jsx("h2",{className:"text-2xl font-bold",children:g?"Edit Metadata Field":"Create Metadata Field"}),e.jsx("p",{className:"text-gray-600",children:g?`Editing "${s?.name}"`:"Define a new custom metadata field with rendering options"})]}),e.jsxs("div",{className:"flex space-x-2",children:[e.jsx("button",{className:"btn btn-ghost",onClick:j,children:"Cancel"}),e.jsx("button",{className:"btn btn-primary",onClick:C,disabled:d.length>0,children:g?"Save Changes":"Create Field"})]})]}),e.jsx("div",{className:"px-6 pt-4",children:e.jsxs("div",{className:"tabs tabs-boxed bg-gray-100",children:[e.jsx("button",{className:`tab ${l==="basic"?"tab-active":""}`,onClick:()=>c("basic"),children:"📝 Basic Settings"}),e.jsx("button",{className:`tab ${l==="rendering"?"tab-active":""}`,onClick:()=>c("rendering"),children:"🎨 Card Rendering"})]})}),e.jsxs("div",{className:"flex-1 overflow-y-auto p-6",children:[d.length>0&&e.jsx("div",{className:"alert alert-error mb-6",children:e.jsxs("div",{children:[e.jsx("h4",{className:"font-medium",children:"Please fix the following errors:"}),e.jsx("ul",{className:"list-disc list-inside text-sm",children:d.map((u,b)=>e.jsx("li",{children:u},b))})]})}),l==="basic"&&e.jsxs("div",{className:"space-y-6",children:[e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-6",children:[e.jsxs("div",{children:[e.jsx("label",{className:"label",children:e.jsx("span",{className:"label-text font-medium",children:"Field Name *"})}),e.jsx("input",{type:"text",className:"input input-bordered w-full",value:i.name||"",onChange:u=>N({name:u.target.value}),placeholder:"e.g., Livestock Count"}),e.jsx("div",{className:"label",children:e.jsx("span",{className:"label-text-alt text-gray-500",children:"This will be displayed in the UI"})})]}),e.jsxs("div",{children:[e.jsx("label",{className:"label",children:e.jsx("span",{className:"label-text font-medium",children:"Field Type *"})}),e.jsxs("select",{className:"select select-bordered w-full",value:i.type||"text",onChange:u=>N({type:u.target.value}),children:[e.jsx("option",{value:"text",children:"Text"}),e.jsx("option",{value:"number",children:"Number"}),e.jsx("option",{value:"boolean",children:"Boolean (True/False)"}),e.jsx("option",{value:"select",children:"Select (Options)"})]})]})]}),e.jsxs("div",{children:[e.jsx("label",{className:"label",children:e.jsx("span",{className:"label-text font-medium",children:"Description"})}),e.jsx("textarea",{className:"textarea textarea-bordered w-full",value:i.description||"",onChange:u=>N({description:u.target.value}),placeholder:"Describe what this field represents...",rows:3})]}),i.type==="select"&&e.jsxs("div",{children:[e.jsx("label",{className:"label",children:e.jsx("span",{className:"label-text font-medium",children:"Options"})}),e.jsxs("div",{className:"space-y-2",children:[(i.options||["Option 1","Option 2"]).map((u,b)=>e.jsxs("div",{className:"flex items-center space-x-2",children:[e.jsx("input",{type:"text",className:"input input-bordered flex-1",value:u,onChange:x=>{const p=[...i.options||[]];p[b]=x.target.value,N({options:p})}}),e.jsx("button",{className:"btn btn-ghost btn-sm text-error",onClick:()=>{const x=(i.options||[]).filter((p,w)=>w!==b);N({options:x})},children:"Remove"})]},b)),e.jsx("button",{className:"btn btn-ghost btn-sm",onClick:()=>{const u=[...i.options||[],"New Option"];N({options:u})},children:"Add Option"})]})]}),i.type==="number"&&e.jsxs("div",{className:"grid grid-cols-2 gap-4",children:[e.jsxs("div",{children:[e.jsx("label",{className:"label",children:e.jsx("span",{className:"label-text font-medium",children:"Minimum Value"})}),e.jsx("input",{type:"number",className:"input input-bordered w-full",value:i.min??0,onChange:u=>N({min:Number(u.target.value)})})]}),e.jsxs("div",{children:[e.jsx("label",{className:"label",children:e.jsx("span",{className:"label-text font-medium",children:"Maximum Value"})}),e.jsx("input",{type:"number",className:"input input-bordered w-full",value:i.max??100,onChange:u=>N({max:Number(u.target.value)})})]})]}),e.jsx("div",{className:"space-y-4",children:e.jsx("div",{className:"form-control",children:e.jsxs("label",{className:"label cursor-pointer justify-start",children:[e.jsx("input",{type:"checkbox",className:"checkbox mr-3",checked:i.required||!1,onChange:u=>N({required:u.target.checked})}),e.jsxs("div",{children:[e.jsx("span",{className:"label-text font-medium",children:"Required field"}),e.jsx("div",{className:"text-xs text-gray-500",children:"Users must provide a value for this field"})]})]})})})]}),l==="rendering"&&e.jsx("div",{className:"space-y-6",children:i&&e.jsx(Gn,{field:i,onChange:N})})]})]})})}function Vn(){const{currentDeck:t,updateMetadataSchema:s}=z(),{currentSchema:n,validationErrors:r,isEditingSchema:a,setSchema:i,addField:o,updateField:l,removeField:c,setEditingSchema:d,generateFieldId:m}=In(),[g,h]=y.useState(!1),[C,j]=y.useState(null);if(y.useEffect(()=>{console.log("MetadataEditor: Checking if we need to initialize schema",{hasCurrentDeckSchema:!!t?.metadataSchema,hasCurrentSchema:!!n,currentDeckName:t?.name}),t?.metadataSchema&&!n&&(console.log("MetadataEditor: Initializing schema from deck",t.metadataSchema),i(t.metadataSchema))},[t?.metadataSchema,n,i]),!t)return e.jsx("div",{className:"p-8 text-center",children:e.jsxs("div",{className:"text-gray-500",children:[e.jsx("div",{className:"text-4xl mb-4",children:"🏷️"}),e.jsx("h3",{className:"text-lg font-medium mb-2",children:"No deck selected"}),e.jsx("p",{children:"Select or create a deck to manage metadata"})]})});const N=()=>{console.log("MetadataEditor: handleSaveSchema called",{hasCurrentSchema:!!n,validationErrorsCount:r.length,currentSchema:n}),n&&r.length===0?(console.log("MetadataEditor: Saving schema to deck",n),s(n),d(!1),console.log("MetadataEditor: Schema saved successfully")):console.log("MetadataEditor: Cannot save - validation errors or no schema")},u=()=>{j(null),h(!0)},b=v=>{j(v),h(!0)},x=v=>{C?l(v.id,v):o(v),h(!1),j(null)},p=()=>{h(!1),j(null)},w=n?.fields||[];return e.jsxs("div",{className:"p-6 space-y-6",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs("div",{children:[e.jsx("h2",{className:"text-2xl font-bold",children:"Custom Metadata"}),e.jsxs("p",{className:"text-gray-600",children:["Define custom metadata schema for ",t.name,". Metadata will be applied at the zone level."]})]}),e.jsxs("div",{className:"flex space-x-2",children:[a&&e.jsxs(e.Fragment,{children:[e.jsx("button",{className:"btn btn-ghost",onClick:()=>d(!1),children:"Cancel"}),e.jsx("button",{className:"btn btn-primary",onClick:N,disabled:r.length>0,children:"Save Schema"})]}),!a&&e.jsx("button",{className:"btn btn-outline",onClick:()=>d(!0),children:"✏️ Edit Schema"})]})]}),r.length>0&&e.jsx("div",{className:"alert alert-error",children:e.jsxs("div",{children:[e.jsx("h4",{className:"font-medium",children:"Schema validation errors:"}),e.jsx("ul",{className:"list-disc list-inside text-sm",children:r.map((v,S)=>e.jsx("li",{children:v.message},S))})]})}),e.jsx("div",{className:"space-y-6",children:e.jsx("div",{className:"card bg-base-100 shadow-sm",children:e.jsxs("div",{className:"card-body",children:[e.jsx("h3",{className:"text-lg font-semibold mb-4",children:"Metadata Schema"}),w.length===0?e.jsxs("div",{className:"text-center py-6",children:[e.jsx("div",{className:"text-gray-500 mb-2",children:"No custom fields defined"}),e.jsx("p",{className:"text-sm text-gray-400",children:"Add custom fields to enable card-specific metadata"})]}):e.jsx("div",{className:"space-y-3",children:w.map(v=>e.jsx("div",{className:"border rounded-lg p-3",children:e.jsxs("div",{className:"flex items-start justify-between",children:[e.jsxs("div",{className:"flex-1",children:[e.jsxs("div",{className:"flex items-center space-x-2",children:[e.jsx("h4",{className:"font-medium",children:v.name}),e.jsx("span",{className:"badge badge-sm",children:v.type}),v.required&&e.jsx("span",{className:"badge badge-error badge-xs",children:"Required"}),v.renderOnCard&&e.jsx("span",{className:"badge badge-success badge-xs",children:"Renders on Card"})]}),v.description&&e.jsx("p",{className:"text-sm text-gray-600 mt-1",children:v.description}),e.jsxs("div",{className:"text-xs text-gray-400 mt-1",children:["ID: ",v.id]})]}),a&&e.jsxs("div",{className:"flex space-x-1",children:[e.jsx("button",{className:"btn btn-ghost btn-sm",onClick:()=>b(v),children:"Edit"}),e.jsx("button",{className:"btn btn-ghost btn-sm text-error",onClick:()=>c(v.id),children:"Delete"})]})]})},v.id))}),a&&e.jsx("div",{className:"mt-6 border-t pt-6",children:e.jsx("button",{className:"btn btn-primary w-full",onClick:u,children:"+ Add New Field"})})]})})}),e.jsx("div",{className:"mt-8",children:e.jsx("div",{className:"card bg-base-100 shadow-sm",children:e.jsxs("div",{className:"card-body",children:[e.jsx("h3",{className:"text-lg font-semibold mb-4",children:"Zone Type Defaults"}),w.length===0?e.jsxs("div",{className:"text-center py-6",children:[e.jsx("div",{className:"text-gray-500 mb-2",children:"No metadata schema defined"}),e.jsx("p",{className:"text-sm text-gray-400",children:"Define metadata fields first to set zone type defaults"})]}):e.jsxs("div",{className:"space-y-4",children:[e.jsx("div",{className:"text-sm text-gray-600 mb-4",children:"Set default metadata values for each zone type. These will be applied when creating new zones."}),t.zoneTypes.map(v=>e.jsxs("div",{className:"border rounded-lg p-4",children:[e.jsxs("div",{className:"flex items-center space-x-3 mb-3",children:[e.jsx("div",{className:"w-6 h-6 rounded-full border-2",style:{backgroundColor:v.color}}),e.jsxs("div",{children:[e.jsx("h4",{className:"font-medium",children:v.name}),e.jsx("p",{className:"text-sm text-gray-500",children:v.description})]})]}),e.jsx("div",{className:"text-sm text-gray-500",children:"Zone type metadata defaults would be configured here in individual zone components."})]},v.id))]})]})})}),e.jsx(Un,{isOpen:g,field:C,onSave:x,onClose:p,generateFieldId:m})]})}function Yn({deckId:t}){const[s,n]=y.useState("editor"),{getDeckById:r,addDeck:a,updateDeck:i}=$e(),{currentDeck:o,hasUnsavedChanges:l,isCardBuilderOpen:c,setCurrentDeck:d,markUnsavedChanges:m,reset:g}=z();y.useEffect(()=>{if(t){const j=r(t);j?(j.customScoringConditions||(j.customScoringConditions=[]),d(j)):(console.error(`Deck with id ${t} not found`),d(null))}else{const N={...{name:"New Custom Deck",description:"A custom deck created with the visual editor",type:"custom",isCustom:!0,baseCards:[],expansions:[],customScoringConditions:[],zoneTypes:[{id:"residential",name:"Residential",color:"#60a5fa",description:"Housing areas"},{id:"commercial",name:"Commercial",color:"#f59e0b",description:"Business districts"},{id:"industrial",name:"Industrial",color:"#6b7280",description:"Manufacturing zones"},{id:"park",name:"Park",color:"#34d399",description:"Green spaces"}],theme:{primaryColor:"#8b5cf6",secondaryColor:"#7c3aed"},metadata:{author:"Player",created:new Date,modified:new Date,version:"1.0"}},id:"temp-new-deck"};d(N)}return()=>{g()}},[t,r,d,g]);const h=()=>{if(o){if(t&&t!=="temp-new-deck"){i(t,{name:o.name,description:o.description,baseCards:o.baseCards,customScoringConditions:o.customScoringConditions,zoneTypes:o.zoneTypes,theme:o.theme,metadataSchema:o.metadataSchema});const j=r(t);j&&d(j)}else{const{id:j,...N}=o,u=a(N),b=r(u);if(b){const x=xe(`/deck-editor/${u}`);window.history.replaceState({},"",x),d(b)}}m(!1)}},C=()=>{l&&!confirm("You have unsaved changes. Are you sure you want to discard them?")||(window.location.href=xe("/"))};return o?e.jsxs("div",{className:"min-h-screen bg-gray-50",children:[e.jsx("div",{className:"bg-white border-b border-gray-200 px-6 py-4",children:e.jsxs("div",{className:"max-w-7xl mx-auto flex items-center justify-between",children:[e.jsxs("div",{children:[e.jsx("h1",{className:"text-3xl font-bold text-gray-900",children:"Deck Editor"}),e.jsx("p",{className:"text-gray-600 mt-1",children:"Design and manage your custom deck"})]}),e.jsxs("div",{className:"flex gap-3",children:[e.jsx("button",{onClick:C,className:"btn btn-ghost",children:"Cancel"}),e.jsx("button",{onClick:h,className:`btn ${l?"btn-primary":"btn-success"}`,disabled:!l,children:l?e.jsxs(e.Fragment,{children:[e.jsx("svg",{className:"w-4 h-4 mr-2",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"})}),"Save Changes"]}):e.jsxs(e.Fragment,{children:[e.jsx("svg",{className:"w-4 h-4 mr-2",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M5 13l4 4L19 7"})}),"Saved"]})})]})]})}),e.jsx("div",{className:"max-w-7xl mx-auto px-6",children:e.jsxs("div",{className:"tabs tabs-boxed bg-white shadow-sm border-b",children:[e.jsx("button",{className:`tab tab-lg ${s==="editor"?"tab-active":""}`,onClick:()=>n("editor"),children:"🛠️ Editor"}),e.jsx("button",{className:`tab tab-lg ${s==="metadata"?"tab-active":""}`,onClick:()=>n("metadata"),children:"🏷️ Metadata"}),e.jsx("button",{className:`tab tab-lg ${s==="analytics"?"tab-active":""}`,onClick:()=>n("analytics"),children:"📊 Analytics"}),e.jsx("button",{className:`tab tab-lg ${s==="testing"?"tab-active":""}`,onClick:()=>n("testing"),children:"🧪 Testing"})]})}),e.jsxs("div",{className:"max-w-7xl mx-auto",children:[s==="editor"&&e.jsx("div",{className:"p-6",children:e.jsxs("div",{className:"grid grid-cols-1 xl:grid-cols-3 gap-8",children:[e.jsx("div",{className:"xl:col-span-1 space-y-6",children:e.jsxs("div",{className:"bg-white rounded-lg shadow-sm border overflow-hidden",children:[e.jsx("div",{className:"px-6 py-4 bg-gray-50 border-b border-gray-200",children:e.jsx("h2",{className:"text-xl font-semibold text-gray-900",children:"Deck Information"})}),e.jsx("div",{className:"p-6",children:e.jsx(Ke,{})})]})}),e.jsxs("div",{className:"xl:col-span-2 space-y-6",children:[e.jsxs("div",{className:"bg-white rounded-lg shadow-sm border overflow-hidden",children:[e.jsxs("div",{className:"px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between",children:[e.jsxs("h2",{className:"text-xl font-semibold text-gray-900",children:["Cards in Deck (",o.baseCards.length,")"]}),e.jsxs("button",{onClick:()=>z.getState().openCardBuilder(),className:"btn btn-primary",children:[e.jsx("svg",{className:"w-5 h-5 mr-2",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M12 6v6m0 0v6m0-6h6m-6 0H6"})}),"Create Card"]})]}),e.jsx("div",{className:"p-6",children:e.jsx(jn,{})})]}),e.jsxs("div",{className:"bg-white rounded-lg shadow-sm border overflow-hidden",children:[e.jsx("div",{className:"px-6 py-4 bg-gray-50 border-b border-gray-200",children:e.jsx("h2",{className:"text-xl font-semibold text-gray-900",children:"Custom Scoring"})}),e.jsx("div",{className:"p-6",children:e.jsx(vn,{})})]})]})]})}),s==="metadata"&&e.jsx(Vn,{}),s==="analytics"&&e.jsx(En,{}),s==="testing"&&e.jsx(_n,{children:e.jsx(Fn,{})})]}),c&&e.jsx(Tn,{})]}):e.jsx("div",{className:"flex items-center justify-center h-screen",children:e.jsxs("div",{className:"text-center",children:[e.jsx("div",{className:"loading loading-spinner loading-lg"}),e.jsx("p",{className:"mt-4 text-lg",children:"Loading deck editor..."})]})})}export{Yn as D};
