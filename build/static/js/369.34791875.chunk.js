"use strict";(self.webpackChunkequabli_front_end=self.webpackChunkequabli_front_end||[]).push([[369],{919:function(e,t,n){var r=n(9126),i=n(184);t.Z=function(e){var t=e.size,n=void 0===t?30:t;return(0,i.jsx)("div",{className:"no_result",children:(0,i.jsxs)("div",{children:[(0,i.jsx)(r.Icw,{size:n}),(0,i.jsx)("p",{children:(0,i.jsx)("b",{children:"No Result"})})]})})}},9369:function(e,t,n){n.d(t,{Z:function(){return A}});var r=n(4165),i=n(5861),o=n(2982),c=n(885),s=n(2791),a=n(9743),l=n(3360),d=n(6149),u=n(2677),m=n(2105),h=n(2576),p=n(2591),x=n(6036),f=n(9126),y=n(8014),j=n(7692),g=n(4651),_=n(6030),v=n(8820),S=n(3728),E=n(3853),b=n(8803),D=n(8116),N=n(184),C=function(e){var t=e.total,n=void 0===t?0:t,r=e.itemsPerPage,i=void 0===r?1:r,o=e.currentPage,l=void 0===o?1:o,d=e.onPageChange,m=(0,s.useState)(0),h=(0,c.Z)(m,2),p=h[0],x=h[1];(0,s.useEffect)((function(){x(n>0&&i>0?Math.ceil(n/i):0)}),[n,i,p]);var f=(0,s.useMemo)((function(){for(var e=[],t=function(t){e.push((0,N.jsx)(D.Z.Item,{active:t+1===l,onClick:function(){return d(t+1)},children:t+1},t))},n=Math.max(0,l-6);n<Math.min(l+5,p);n++)t(n);return e}),[p,l,d]);return 0===p?null:(0,N.jsx)("div",{style:{marginTop:"1rem"},children:(0,N.jsxs)(a.Z,{children:[(0,N.jsx)(u.Z,{md:6,xs:12,children:(0,N.jsxs)("p",{children:["Showing ",(l-1)*i+1," to ",l*i>n?n:l*i," of ",n," records"]})}),(0,N.jsx)(u.Z,{md:6,xs:12,children:(0,N.jsxs)(D.Z,{className:"justify-content-end",children:[(0,N.jsx)(D.Z.First,{onClick:function(){return d(1)},disabled:1===l}),(0,N.jsx)(D.Z.Prev,{onClick:function(){return d(l-1)},disabled:1===l}),f,(0,N.jsx)(D.Z.Next,{onClick:function(){return d(l+1)},disabled:l===p}),(0,N.jsx)(D.Z.Last,{onClick:function(){return d(p)},disabled:l===p})]})})]})})},k=n(4880),Z=n(2296),w=n(8254),R=n(919),L=n(3619),O=function(e){var t=e.trigger,n=e.menu,r=s.useState(!1),i=(0,c.Z)(r,2),o=i[0],a=i[1];return(0,N.jsxs)("div",{className:"custom_dropdown",children:[s.cloneElement(t,{onClick:function(){a(!o)}}),o?(0,N.jsx)("ul",{className:"custom_menu",children:n.map((function(e,t){return(0,N.jsx)("li",{className:"menu-item",children:s.cloneElement(e,{onClick:function(){e.props.onClick()}})},"custom_".concat(t))}))}):null]})},A=function(e){var t=e.data,n=e.isLoading,D=e.map,A=e.onPaginationChange,q=e.totalCount,T=e.isPagination,F=void 0===T||T,I=e.actionArray,M=void 0===I?[]:I,U=e.currentPage,z=e.setCurrentPage,V=e.handleNavigate,P=e.colorArray,W=void 0===P?[]:P,H=e.currencyColumns,B=void 0===H?[]:H,Y=e.sorting,J=void 0===Y||Y,Q=e.sortElement,$=e.sortType,G=e.addEditArray,K=void 0===G?{}:G,X=e.tableAction,ee=void 0===X?[]:X,te=e.parentComponent,ne=void 0===te?"":te,re=(e.loadingHeight,e.hideShareArray),ie=void 0===re?[]:re,oe=(e.searchCriteria,e.handleDocumentManagerSummary),ce=(0,_.I0)(),se=(0,k.k6)(),ae=(0,s.useState)(!1),le=(0,c.Z)(ae,2),de=le[0],ue=le[1],me=(0,s.useState)([]),he=(0,c.Z)(me,2),pe=he[0],xe=he[1],fe=(0,s.useState)([]),ye=(0,c.Z)(fe,2),je=ye[0],ge=ye[1],_e=(0,s.useState)(10),ve=(0,c.Z)(_e,2),Se=ve[0],Ee=ve[1],be=(0,s.useState)(!1),De=(0,c.Z)(be,2),Ne=(De[0],De[1]),Ce=[10,50,100],ke=(0,s.useState)(ie),Ze=(0,c.Z)(ke,2),we=Ze[0],Re=Ze[1];(0,s.useEffect)((function(){F&&t&&t.length>0&&A(Se,U)}),[U,Se]),(0,s.useEffect)((function(){ie.length>0&&Re(ie)}),[ie]),(0,s.useEffect)((function(){if(t&&t.length>0){var e=Object.keys(D).filter((function(e){return we.includes(e)}));ge(e)}}),[we,t]);var Le=function(e){var t=e.target,n=t.id,r=t.checked,i=Object.assign([],we),c=[];c=r?[].concat((0,o.Z)(i),[n]):i.filter((function(e){return e!==n})),Re(c),ce(Z.v.saveColumn({parentComponent:ne,showHideColumns:c}))},Oe=function(){var e=(0,i.Z)((0,r.Z)().mark((function e(){return(0,r.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:ce("documents"===ne?L.p.downloadDocument(pe):L.p.downloadFolder(pe));case 1:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),Ae=function(e,t){return(0,N.jsx)(N.Fragment,{children:(0,N.jsxs)("span",{style:{position:"absolute",left:"10px"},children:["servicingRequestId"===e&&"Approved"===t.requestStatus&&(0,N.jsx)(m.Z,{placement:"right",delay:{show:250,hide:400},overlay:(0,N.jsx)(h.Z,{id:"tooltip-error",children:"Approved"}),children:(0,N.jsx)(f.oFd,{size:30,style:{color:"#68c803"}})}),"servicingRequestId"===e&&"Rejected"===t.requestStatus&&(0,N.jsx)(m.Z,{placement:"right",delay:{show:250,hide:400},overlay:(0,N.jsx)(h.Z,{id:"tooltip-error",children:"Rejected"}),children:(0,N.jsx)(f.z3f,{size:30,style:{color:"red"}})}),"servicingRequestId"===e&&"Requested"===t.requestStatus&&(0,N.jsx)(m.Z,{placement:"right",delay:{show:250,hide:400},overlay:(0,N.jsx)(h.Z,{id:"tooltip-error",children:"Requested"}),children:(0,N.jsx)(y.VbM,{size:30,style:{color:t.ragStatus}})}),"servicingRequestId"===e&&"Cancelled"===t.requestStatus&&(0,N.jsx)(m.Z,{placement:"right",delay:{show:250,hide:400},overlay:(0,N.jsx)(h.Z,{id:"tooltip-error",children:"Cancelled"}),children:(0,N.jsx)(S.VuA,{size:30,style:{color:t.ragStatus}})})]})})},qe=function(e,t){return(0,N.jsx)(N.Fragment,{children:"Requested"===t.requestStatus&&(0,N.jsxs)("span",{style:{position:"absolute",left:"50px"},children:["servicingRequestId"===e&&"High"===t.priorityExecution&&(0,N.jsx)(m.Z,{placement:"right",delay:{show:250,hide:400},overlay:(0,N.jsx)(h.Z,{id:"tooltip-error",children:"Priority - High"}),children:(0,N.jsx)(S.eEn,{size:30,style:{color:"#68c803"}})}),"servicingRequestId"===e&&"Medium"===t.priorityExecution&&(0,N.jsx)(m.Z,{placement:"right",delay:{show:250,hide:400},overlay:(0,N.jsx)(h.Z,{id:"tooltip-error",children:"Priority - Medium"}),children:(0,N.jsx)(S.DC9,{size:30,style:{color:"red"}})}),"servicingRequestId"===e&&"Low"===t.priorityExecution&&(0,N.jsx)(m.Z,{placement:"right",delay:{show:250,hide:400},overlay:(0,N.jsx)(h.Z,{id:"tooltip-error",children:"Priority - Low"}),children:(0,N.jsx)(S.ePU,{size:30,style:{color:t.ragStatus}})})]})})},Te=function(e,t){var n=document.querySelectorAll(".header_desc"),r=document.querySelectorAll(".header_asc");Array.from(n).map((function(e){return e.classList.remove("active")})),Array.from(r).map((function(e){return e.classList.remove("active")})),Q(e),$(t),document.querySelector(".".concat(e,"_").concat(t)).classList.add("active")},Fe=function(e,t){if(!e)return"";var n=e.split(",");return n=n.map((function(e,r){return(0,N.jsxs)("span",{id:"index",onClick:function(){return function(e,t){se.push({pathname:"/search/".concat("inventory"===ne?"inventory":"account_search","/compliance_details"),search:"cId=".concat(e,"&clientId=").concat(t.clientId,"&cAn=").concat(t.clientAccountNumber,"&aId=").concat(t.equabliAccountNumber)})}(e,t)},className:"clickable_td_emp",children:[e,r<n.length-1?", ":""," "]},"compliance_".concat(r))})),n},Ie=function(e){return(0,N.jsx)("div",{style:{display:"flex",flexDirection:"row",flexWrap:"wrap"},children:e&&e.map((function(e,t){return(0,N.jsx)("p",{style:{background:"#ff7765",color:"white",borderRadius:".3rem",padding:".1rem .5rem",marginRight:"1rem"},children:e},"service_".concat(t))}))})},Me=function(e){return e&&e.map((function(e,t){return(0,N.jsx)("p",{style:{textAlign:"left",marginBottom:"0",paddingLeft:"1rem"},children:(0,N.jsxs)("span",{children:[(0,N.jsx)("b",{children:e.type}),": ","".concat(e.count," Accounts/Week")]})},"capacity_".concat(t))}))},Ue=function(e){return e&&e.map((function(e,t){return(0,N.jsx)("p",{style:{textAlign:"left",marginBottom:"0",paddingLeft:"1rem"},children:(0,N.jsxs)("span",{children:[(0,N.jsx)("b",{children:e.type}),": ","".concat(e.percentage,"%")]})},"commission_".concat(t))}))},ze=function(e){return(0,N.jsx)("p",{style:{textAlign:"left",marginBottom:"0",paddingLeft:"1rem"},children:(0,N.jsxs)("span",{children:[(0,N.jsxs)("b",{children:[e,"%"]})," of accounts receive disputes of complaints"]})})},Ve=function(e){return e&&e.map((function(e,t){return(0,N.jsx)("p",{style:{textAlign:"left",marginBottom:"0",paddingLeft:"1rem"},children:(0,N.jsxs)("span",{children:[(0,N.jsx)("b",{children:e.type}),": ","$".concat(e.amount)]})},"collection_".concat(t))}))},Pe=function(e){var t=e.target,n=t.id,r=t.checked,i=JSON.parse(n);n="documents"===ne?Number(i.id):i.folderName,xe([].concat((0,o.Z)(pe),[n])),r||xe(pe.filter((function(e){return e!==n})))},We=function(e){if("sentDocumentRequest"===ne||"receiveDocumentRequest"===ne){if("Open"===e.requestStatus&&new Date(e.dueDate)>=new Date)return"#b2e7d0";if("Open"===e.requestStatus&&new Date(e.dueDate)<new Date)return"#fbbdc3";if("Fulfilled"===e.requestStatus)return"white"}},He=function(){return(0,N.jsx)("thead",{children:(0,N.jsxs)("tr",{style:{lineHeight:"35px",backgroundColor:"#000",color:"white"},children:[("myRequests"===ne||"pendingForApproval"===ne||"pendingMyApproval"===ne)&&(0,N.jsx)("th",{children:"#"}),("myDocuments"===ne||"documents"===ne)&&(0,N.jsx)("th",{className:"span1",children:(0,N.jsx)("div",{className:"table_header_container",style:{minWidth:"20px",height:"30px",alignItems:"center"},children:(0,N.jsx)(d.Z.Control,{type:"Checkbox",onChange:function(){return ue(!de),xe(t.map((function(e){return"documents"===ne?Number(e.id):e.folderName}))),void(de&&xe([]))},style:{cursor:"pointer"}})})}),je&&je.map((function(e,t){if("recordStatusVal"!==e&&"batchSchedulerGroupId"!==e&&"logDescription"!==e&&"queueId"!==e&&"slaStatus"!==e&&"alertDefinition"!==e&&"RFILink"!==e&&"auditLink"!==e)return(0,N.jsx)("th",{className:"span1",children:(0,N.jsxs)("div",{className:"table_header_container",style:{minWidth:-1!==["servicesOffered","capacity","commissionRate","accountTypeServiced","compliance","collections"].indexOf(e)?"300px":-1!==["preview","upload","download","autoRenew"].indexOf(e)?"110px":"220px"},children:[(0,N.jsx)("div",{children:D[e]?D[e]:e}),J&&(0,N.jsxs)("div",{className:"sorting",children:[(0,N.jsx)(x.qwl,{size:12,className:"header_asc ".concat(e,"_asc"),onClick:function(){return Te(e,"asc")}}),(0,N.jsx)(x.dbR,{size:12,className:"header_desc ".concat(e,"_desc"),onClick:function(){return Te(e,"desc")}})]})]})},"header_".concat(t))})),("undefined"!==typeof K.edit||"undefined"!==typeof K.view&&-1!==je.indexOf("alertDefinition"))&&(0,N.jsx)("th",{className:"span1",style:{minWidth:"130px"},children:"Action Items"}),"undefined"!==typeof ee.openSolModal&&-1!==je.indexOf("dtClientStatute")&&(0,N.jsx)("th",{className:"span1",style:{minWidth:"130px",textAlign:"center"},children:"Action"}),("myDocuments"===ne||"documents"===ne||"sentDocumentRequest"===ne||"receiveDocumentRequest"===ne||"downloadHistory"===ne||"clientSetup"===ne||"partnerSetup"===ne)&&(0,N.jsx)("th",{className:"span1",style:{minWidth:"130px",textAlign:"center"},children:"Actions"})]})})},Be=function(){return(0,N.jsx)("tbody",{children:t&&t.map((function(e,t){return(0,N.jsxs)("tr",{style:{lineHeight:"30px",textAlign:"center",position:"relative",zIndex:9,backgroundColor:We(e)},children:[("myRequests"===ne||"pendingForApproval"===ne||"pendingMyApproval"===ne)&&(0,N.jsx)("th",{children:t+1}),("myDocuments"===ne||"documents"===ne)&&(0,N.jsx)("th",{className:"span1",children:(0,N.jsx)("div",{className:"table_header_container",style:{minWidth:"20px",height:"30px",alignItems:"center"},children:(0,N.jsx)(d.Z.Control,{type:"Checkbox",id:JSON.stringify(e),checked:pe.includes("documents"===ne?e.id:e.folderName),style:{cursor:"pointer"},onChange:Pe})})}),je.map((function(t,n){if("recordStatusVal"!==t&&"batchSchedulerGroupId"!==t&&"logDescription"!==t&&"slaStatus"!==t&&"queueId"!==t&&"alertDefinition"!==t&&"RFILink"!==t&&"auditLink"!==t)return M.includes(t)?(0,N.jsxs)("td",{style:{background:"complianceId"===t?e.slaStatus:"",color:"complianceId"===t&&e.slaStatus?"white":""},className:"clickable_td ".concat((0,b.$1)(e[t],t)?"td_number":"td_string"),children:[Ae(t,e),qe(t,e),"folderName"===t&&"myDocuments"===ne&&(0,N.jsxs)("div",{style:{display:"flex",alignItems:"center"},children:[(0,N.jsx)(v.On3,{size:20}),(0,N.jsx)("span",{style:{paddingLeft:".7rem"},onClick:function(){return V(e,t)},className:"clickable_td_emp",children:e[t]})]}),"folderName"!==t&&"myDocuments"!==ne&&(0,N.jsx)("span",{onClick:function(){return V(e,t)},className:"clickable_td_emp",children:e[t]})]},"data_2".concat(n)):"isValidationRequired"===t?(0,N.jsx)("td",{children:e[t]?"Yes":"No"},"data_2".concat(n)):"isExcluded"===t?(0,N.jsx)("td",{children:e[t]?"Y":"N"},"data_2".concat(n)):"isAdditionalTimeRequired"===t||"isMasterserviced"===t||"isEqassociate"===t?(0,N.jsx)("td",{children:e[t]?"Yes":"No"},"data_2".concat(n)):"keyContacts"===t?(0,N.jsx)("td",{children:(i=e[t],i&&i.map((function(e,t){return(0,N.jsxs)("p",{style:{textAlign:"left",paddingLeft:"1rem"},children:[(0,N.jsx)("span",{children:e.name})," ",(0,N.jsx)("br",{}),(0,N.jsx)("span",{children:e.phone})]},"contact_".concat(t))})))},"data_2".concat(n)):"servicesOffered"===t||"accountTypeServiced"===t?(0,N.jsx)("td",{children:Ie(e[t])},"data_2".concat(n)):"partnerSearch"!==ne||"accountType"!==t&&"productType"!==t?"capacity"===t?(0,N.jsx)("td",{children:Me(e[t])},"data_2".concat(n)):"commissionRate"===t?(0,N.jsx)("td",{children:Ue(e[t])},"data_2".concat(n)):"compliance"===t?(0,N.jsx)("td",{children:ze(e[t])},"data_2".concat(n)):"partnerSearch"!==ne&&"collections"===t?(0,N.jsx)("td",{children:Ve(e[t])},"data_2".concat(n)):"sharedWith"===t||"shareBy"===t||"sharedBy"===t?(0,N.jsx)("td",{children:(r=e[t],r&&0===r.length?"-":(0,N.jsx)("div",{className:"share_With_parent",children:r&&r.map((function(e,t){return e.profilePicture?(0,N.jsx)(m.Z,{placement:"bottom",delay:{show:250,hide:400},overlay:(0,N.jsx)(h.Z,{id:"tooltip-error",children:"Name: ".concat(e.name,"\n                                        Email: ").concat(e.email)}),children:(0,N.jsx)("img",{src:e.profilePicture,style:{marginLeft:0!==t?"-.5rem":"",marginBottom:"0"},loading:"lazy",alt:"",className:"profile_pic_share"})},"sw_".concat(t)):(0,N.jsx)(m.Z,{placement:"bottom",delay:{show:250,hide:400},overlay:(0,N.jsx)(h.Z,{id:"tooltip-error",children:"Name: ".concat(e.name,"\n                                        Email: ").concat(e.email)}),children:(0,N.jsx)("span",{className:"shared_with",style:{marginLeft:0!==t?"-.5rem":"",marginBottom:"0"},children:(null===e||void 0===e||null===(n=e.name)||void 0===n?void 0:n.charAt(0).toUpperCase())||"E"})},"sw_".concat(t));var n}))}))},"data_2".concat(n)):"preview"===t?(0,N.jsx)("td",{children:(0,N.jsx)(f.q3A,{size:24})},"data_2".concat(n)):"upload"===t?(0,N.jsx)("td",{children:(0,N.jsx)(v.IEK,{size:24})},"data_2".concat(n)):"download"===t?(0,N.jsx)("td",{children:(0,N.jsx)(v.xOH,{size:24})},"data_2".concat(n)):"fileName"===t?function(e,t){return e.documentName||e.fileName?(0,N.jsx)("td",{className:"clickable_td td_string",children:(0,N.jsxs)("div",{style:{display:"inline-flex"},children:[(0,N.jsx)(f.q3A,{size:24}),(0,N.jsx)("div",{className:"file_name clickable_td_emp",onClick:function(){return K.viewDocument(e)},children:e.documentName?e.documentName:e.fileName})]})},"documentName_".concat(t)):(0,N.jsxs)("td",{className:"center_align_td",children:[(0,N.jsx)(v.DTH,{size:24}),"sentDocumentRequest"===ne?"Pending":"Not Provided Yet"]},"documentName_".concat(t))}(e,n):e[t]?"partnerStatus"===t?(0,N.jsxs)("td",{style:{textAlign:"left"},children:[(0,N.jsx)("span",{style:{backgroundColor:"Equabli Recommended"===e.partnerStatus?"#ff7765":"Equabli Approved"===e.partnerStatus?"rgb(0, 235, 165)":"#00b5fc",color:"white",padding:".3rem 1rem",borderRadius:".3rem"},children:e[t]}),(0,N.jsx)("br",{}),("Equabli Recommended"===e.partnerStatus||"Equabli Approved"===e.partnerStatus)&&(0,N.jsxs)(N.Fragment,{children:[(0,N.jsx)("b",{children:(0,N.jsx)("a",{href:e.RFILink,children:"Review RFI"})}),(0,N.jsx)("br",{}),(0,N.jsx)("b",{children:(0,N.jsx)("a",{href:e.auditLink,children:"Review Audit"})})]})]},"data_2".concat(n)):"executionStatusVal"===t?(0,N.jsx)("td",{children:(0,N.jsxs)("span",{style:{display:"flex",alignItems:"center",justifyContent:"center"},children:[e[t],(0,N.jsx)(m.Z,{placement:"right",delay:{show:250,hide:400},overlay:(0,N.jsx)(h.Z,{id:"tooltip-error",children:e.logDescription}),children:(0,N.jsx)(v.znh,{size:20,style:{marginLeft:"1rem"}})})]})},"data_2".concat(n)):"complianceIds"===t?(0,N.jsx)("td",{className:"clickable_td ".concat((0,b.$1)(e[t],t)?"td_number":"td_string"),children:Fe(e[t],e)},"data_2".concat(n)):W.includes(t)?(0,N.jsx)("td",{style:{backgroundColor:"".concat(e[t])},children:""},"data_2".concat(n)):(0,N.jsxs)("td",{className:"".concat((0,b.$1)(e[t],t)?"td_number":"td_string"),children:[-1!==B.indexOf(t)?"$":""," ",e[t]]},"data_2".concat(n)):(0,N.jsx)("td",{children:(0,N.jsx)("b",{children:"-"})},"data_2".concat(n)):(0,N.jsx)("td",{children:Ie(e[t])},"data_2".concat(n));var r,i})),"undefined"!==typeof ee.openSolModal&&-1!==je.indexOf("dtClientStatute")&&(0,N.jsx)("td",{className:"span1",children:(0,N.jsx)(l.Z,{variant:"dark",onClick:function(){return ee.openSolModal(e)},children:"Set SOL"})},"data_".concat(t)),"undefined"!==typeof K.edit&&(0,N.jsx)(N.Fragment,{children:(0,N.jsx)("td",{className:"span1",children:(0,N.jsxs)("span",{style:{display:"flex",justifyContent:"center",alignItems:"center"},children:["Deleted"!==e.recordStatusVal&&(0,N.jsx)(m.Z,{placement:"bottom",delay:{show:250,hide:400},overlay:(0,N.jsx)(h.Z,{id:"tooltip-error",children:"Edit"}),children:(0,N.jsx)(j.n2B,{onClick:function(){return K.edit(e)},size:20,style:{margin:"0 .5rem",cursor:"pointer"}})}),"Deleted"===e.recordStatusVal&&(0,N.jsx)(m.Z,{placement:"bottom",delay:{show:250,hide:400},overlay:(0,N.jsx)(h.Z,{id:"tooltip-error",children:"View"}),children:(0,N.jsx)(f.rCC,{onClick:function(){return K.edit(e)},size:20,style:{margin:"0 .5rem",cursor:"pointer"}})}),"Deleted"!==e.recordStatusVal&&(0,N.jsx)(m.Z,{placement:"bottom",delay:{show:250,hide:400},overlay:(0,N.jsx)(h.Z,{id:"tooltip-error",children:"Delete"}),children:(0,N.jsx)(v.VPh,{onClick:function(){return K.delete(t)},size:20,style:{margin:"0 .5rem",cursor:"pointer"}})}),"Disabled"===e.recordStatusVal&&(0,N.jsx)(m.Z,{placement:"bottom",delay:{show:250,hide:400},overlay:(0,N.jsx)(h.Z,{id:"tooltip-error",children:"Click to unlock"}),children:(0,N.jsx)(f.qbv,{onClick:function(){return K.update(t)},size:18,style:{margin:"0 .5rem",color:"red",cursor:"pointer"}})}),"Enabled"===e.recordStatusVal&&(0,N.jsx)(m.Z,{placement:"bottom",delay:{show:250,hide:400},overlay:(0,N.jsx)(h.Z,{id:"tooltip-error",children:"Click to lock"}),children:(0,N.jsx)(f.E4o,{onClick:function(){return K.update(t)},size:18,style:{margin:"0 .5rem",color:"rgb(76, 175, 80)",cursor:"pointer"}})}),("Enabled"===e.recordStatusVal||"Disabled"===e.recordStatusVal)&&"undefined"!==typeof K.execute&&(0,N.jsx)(m.Z,{placement:"bottom",delay:{show:250,hide:400},overlay:(0,N.jsx)(h.Z,{id:"tooltip-error",children:"Execute"}),children:(0,N.jsx)(g.RS3,{onClick:function(){return K.execute(t)},size:18,style:{margin:"0 .5rem",color:"rgb(76, 175, 80)",cursor:"pointer"}})}),"Deleted"===e.recordStatusVal&&(0,N.jsx)(m.Z,{placement:"bottom",delay:{show:250,hide:400},overlay:(0,N.jsx)(h.Z,{id:"tooltip-error",children:"Deleted"}),children:(0,N.jsx)(S.VuA,{size:20,style:{color:e.ragStatus,margin:"0 .5rem"}})})]})},"data_".concat(t))}),"undefined"!==typeof K.view&&void 0!==e.alertDefinition&&(0,N.jsx)(N.Fragment,{children:(0,N.jsx)("td",{className:"span1",children:(0,N.jsx)("span",{style:{display:"flex",justifyContent:"center",alignItems:"center"},children:(0,N.jsx)("p",{onClick:function(){return K.view(e.alertDefinition)},style:{margin:"0 .5rem",cursor:"pointer",color:"#FF7765"},children:"View Email"})})},"data_".concat(t))}),("myDocuments"===ne||"documents"===ne||"sentDocumentRequest"===ne||"receiveDocumentRequest"===ne||"downloadHistory"===ne||"clientSetup"===ne||"partnerSetup"===ne)&&(0,N.jsxs)("td",{className:"span1",style:{minWidth:"140px",textAlign:"center"},children:["undefined"!==typeof K.upload&&!e.documentName&&(0,N.jsxs)("span",{children:[(0,N.jsx)(m.Z,{placement:"bottom",delay:{show:250,hide:400},overlay:(0,N.jsx)(h.Z,{id:"tooltip-error",children:"Upload"}),children:(0,N.jsx)(v.IEK,{onClick:function(){return K.upload(e)},size:20,style:{cursor:"pointer"}})}),"\xa0"]}),"undefined"!==typeof K.view&&(0,N.jsxs)("span",{children:[(0,N.jsx)(m.Z,{placement:"bottom",delay:{show:250,hide:400},overlay:(0,N.jsx)(h.Z,{id:"tooltip-error",children:"View"}),children:(0,N.jsx)(v.Zju,{onClick:function(){return K.view(e)},size:20,style:{cursor:"pointer"}})}),"\xa0"]}),"undefined"!==typeof K.download&&("receiveDocumentRequest"===ne&&e.documentName||"myDocuments"===ne||"documents"===ne||"sentDocumentRequest"===ne||"downloadHistory"===ne)&&(0,N.jsxs)("span",{children:[(0,N.jsx)(m.Z,{placement:"bottom",delay:{show:250,hide:400},overlay:(0,N.jsx)(h.Z,{id:"tooltip-error",children:"Download"}),children:(0,N.jsx)(v.xOH,{style:{color:"sentDocumentRequest"!==ne||e.documentName?"black":"#bebebe",cursor:"sentDocumentRequest"!==ne||e.documentName?"pointer":"not-allowed"},onClick:function(){("sentDocumentRequest"!==ne||e.documentName)&&K.download(e)},size:20})}),"\xa0"]}),"undefined"!==typeof K.share&&(0,N.jsxs)("span",{children:[(0,N.jsx)(m.Z,{placement:"bottom",delay:{show:250,hide:400},overlay:(0,N.jsx)(h.Z,{id:"tooltip-error",children:"Share"}),children:(0,N.jsx)(E.PMT,{size:20,onClick:function(){return K.share(e)},style:{cursor:"pointer"}})}),"\xa0"]}),"undefined"!==typeof K.editClient&&(0,N.jsxs)("span",{children:[(0,N.jsx)(m.Z,{placement:"bottom",delay:{show:250,hide:400},overlay:(0,N.jsx)(h.Z,{id:"tooltip-error",children:"Share"}),children:(0,N.jsx)(j.n2B,{size:20,onClick:function(){return K.editClient(e)},style:{cursor:"pointer"}})}),"\xa0"]}),"undefined"!==typeof K.delete&&(0,N.jsx)("span",{children:(0,N.jsx)(m.Z,{placement:"bottom",delay:{show:250,hide:400},overlay:(0,N.jsx)(h.Z,{id:"tooltip-error",children:"Delete"}),children:(0,N.jsx)(v.VPh,{onClick:function(){return K.delete(e)},size:20,style:{cursor:"pointer"}})})})]},"data_".concat(t))]},"data_".concat(t))}))})};return(0,N.jsxs)("div",{className:"table_container",children:[F&&q>0?(0,N.jsxs)(a.Z,{className:"table_top_section",children:[("documentSummary"===ne||"documentNotSummary"===ne)&&(0,N.jsx)(N.Fragment,{children:(0,N.jsxs)(l.Z,{className:"summary_history_button",onClick:function(){return function(){oe.documentType=oe.documentType.replace(/[^\w\s]/gi," ");var e="/documents/accounts_missing_documents";"documentNotSummary"===ne&&(e="/documents/accounts_documents"),se.push({pathname:e,search:new URLSearchParams(oe).toString()})}()},children:["View ","documentNotSummary"===ne?oe.complete:oe.inComplete," Accounts ","documentNotSummary"===ne?"":"not"," having ",oe.documentType.replace(/[^\w\s]/gi," ")]})}),!n&&("account"===ne||"consumer"===ne||"inventory"===ne||"sol"===ne)&&(0,N.jsx)(l.Z,{variant:"dark",style:{marginRight:"1rem"},onClick:function(){return Ne(!0)},children:"Download"}),!n&&("myDocuments"===ne||"sentDocumentRequest"===ne||"receiveDocumentRequest"===ne||"documents"===ne||"documentSummary"===ne||"documentNotSummary"===ne)&&(0,N.jsxs)(N.Fragment,{children:[("myDocuments"===ne||"documents"===ne)&&pe&&pe.length>0&&(0,N.jsx)(l.Z,{variant:"dark",style:{marginRight:"1rem"},onClick:function(){return Oe()},children:"Export"}),(0,N.jsx)(O,{trigger:(0,N.jsx)("button",{style:{cursor:"pointer"},children:"Show/Hide Columns"}),menu:Object.keys(D).map((function(e,t){return(0,N.jsxs)("button",{onClick:function(){},children:[(0,N.jsx)(d.Z.Control,{type:"Checkbox",id:e,defaultChecked:we.includes(e),style:{cursor:"pointer",width:"auto",marginRight:"1rem"},onClick:Le}),(0,N.jsx)("span",{children:D[e]})]},"Hide_".concat(t))}))})]}),(0,N.jsxs)(d.Z.Group,{as:a.Z,children:[(0,N.jsx)(d.Z.Label,{column:!0,md:3,sm:12,style:{textAlign:"right"},children:"Size"}),(0,N.jsx)(u.Z,{md:9,sm:12,children:(0,N.jsx)(d.Z.Control,{as:"select",name:"status",onChange:function(e){return Ee(e.target.value),void z(1)},defaultValue:Se,children:Ce&&Ce.map((function(e,t){return(0,N.jsx)("option",{value:e,children:e},"size_".concat(t))}))})})]})]}):null,!n&&(0,N.jsx)(p.Z,{striped:!0,hover:!0,responsive:!0,size:"sm",className:"tableHeight",style:{marginBottom:0},children:q>0?(0,N.jsxs)(N.Fragment,{children:[He(),Be()]}):(0,N.jsx)("thead",{children:(0,N.jsx)("tr",{className:"no_records",style:{lineHeight:"35px",backgroundColor:"#e9ecef",textAlign:"center"},children:(0,N.jsx)("td",{children:(0,N.jsx)(R.Z,{})})})})}),n&&(0,N.jsx)("div",{children:(0,N.jsx)(w.Z,{isTable:!0,repeats:5})}),F&&(0,N.jsx)(C,{total:q,itemsPerPage:Se,currentPage:U,onPageChange:function(e){z(e)}})]})}},8254:function(e,t,n){var r=n(184),i=function(e){return(0,r.jsxs)("div",{children:[(0,r.jsx)("div",{className:"skeleton-box"}),(0,r.jsx)("div",{className:"skeleton-box"}),(0,r.jsx)("div",{className:"skeleton-box"}),(0,r.jsx)("div",{className:"skeleton-box"}),(0,r.jsx)("div",{className:"skeleton-box"}),(0,r.jsx)("div",{className:"skeleton-box"})]},"skeleton_".concat(e))};t.Z=function(e){var t=e.repeats,n=void 0===t?2:t,o=e.isTable,c=void 0!==o&&o;return(0,r.jsx)(r.Fragment,{children:function(){var e,t=[];if(c){for(var o=[],s=0;s<n;s++)o.push(i(s));t.push((0,r.jsxs)("div",{children:[(0,r.jsx)("div",{className:"table_header_skeleton",children:i(1)}),(0,r.jsx)("div",{className:"table_body_skeleton",children:o})]},"sk_".concat(10*Math.random())))}else for(var a=0;a<n;a++)t.push((e=a,(0,r.jsxs)("div",{style:{marginBottom:"1rem"},children:[(0,r.jsx)("div",{className:"skeleton-box"}),(0,r.jsx)("div",{className:"skeleton-box-small"})]},"div_".concat(e))));return t}()})}},3619:function(e,t,n){n.d(t,{p:function(){return o}});var r=n(758),i=n(2453),o={getMyDocumentFolders:function(e){return function(t){t({type:r.FE.MY_DOCUMENTS_FOLDER_REQUEST}),i._9.getMyDocumentFolders(e).then((function(e){t(function(e){return{type:r.FE.MY_DOCUMENTS_FOLDER_SUCCESS,payload:e}}(e))}),(function(e){t(function(e){return{type:r.FE.MY_DOCUMENTS_FOLDER_FAILURE,payload:e}}(e))}))}},getMyDocumentList:function(e){return function(t){t({type:r.ab.MY_DOCUMENTS_LIST_REQUEST}),i._9.getMyDocumentList(e).then((function(e){t(function(e){return{type:r.ab.MY_DOCUMENTS_LIST_SUCCESS,payload:e}}(e))}),(function(e){t(function(e){return{type:r.ab.MY_DOCUMENTS_LIST_FAILURE,payload:e}}(e))}))}},resetDocumentList:function(){return function(e){e((function(){return e({type:r.ab.MY_DOCUMENTS_LIST_RESET})}))}},deleteDocument:function(e){return function(t){t({type:r.Vs.DELETE_DOCUMENTS_REQUEST}),i._9.deleteDocument(e).then((function(e){t(function(e){return{type:r.Vs.DELETE_DOCUMENTS_SUCCESS,payload:e}}(e))}),(function(e){t(function(e){return{type:r.Vs.DELETE_DOCUMENTS_FAILURE,payload:e}}(e))})).finally(t({type:r.Vs.DELETE_DOCUMENTS_RESET}))}},deleteFolder:function(e){return function(t){t({type:r.qJ.DELETE_FOLDER_REQUEST}),i._9.deleteFolder(e).then((function(e){t(function(e){return{type:r.qJ.DELETE_FOLDER_SUCCESS,payload:e}}(e))}),(function(e){t(function(e){return{type:r.qJ.DELETE_FOLDER_FAILURE,payload:e}}(e))})).finally(t({type:r.qJ.DELETE_FOLDER_RESET}))}},downloadFolder:function(e){return function(t){t({type:r.x9.DOWNLOAD_FOLDER_REQUEST}),i._9.downloadFolder(e).then((function(e){t(function(e){return{type:r.x9.DOWNLOAD_FOLDER_SUCCESS,payload:e}}(e))}),(function(e){t(function(e){return{type:r.x9.DOWNLOAD_FOLDER_FAILURE,payload:e}}(e))}))}},restDownloadFolder:function(){return function(e){e({type:r.x9.DOWNLOAD_FOLDER_RESET})}},restDownloadDocument:function(){return function(e){e({type:r.UL.DOWNLOAD_DOCUMENT_RESET})}},downloadDocument:function(e){return function(t){t({type:r.UL.DOWNLOAD_DOCUMENT_REQUEST}),i._9.downloadDocument(e).then((function(e){t(function(e){return{type:r.UL.DOWNLOAD_DOCUMENT_SUCCESS,payload:e}}(e))}),(function(e){t(function(e){return{type:r.UL.DOWNLOAD_DOCUMENT_FAILURE,payload:e}}(e))})).finally(t({type:r.UL.DOWNLOAD_DOCUMENT_RESET}))}}}}}]);
//# sourceMappingURL=369.34791875.chunk.js.map