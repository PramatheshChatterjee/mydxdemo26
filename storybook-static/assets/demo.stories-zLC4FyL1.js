import{j as o}from"./iframe-BWmdfLve.js";import{L as N,M as c}from"./styled-components.browser.esm-BaHrqaV2.js";import"./preload-helper-Dp1pzeXC.js";const j=N.span`
  display: inline-flex;
  align-items: center;
  gap: 0.625rem;
  box-sizing: border-box;
  max-width: 100%;
  padding: 0.375rem 1rem;
  border-radius: 999px;
  vertical-align: middle;
  font-family: inherit;
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.5;

  .badge-icon {
    flex-shrink: 0;
    width: 1.5em;
    height: 1.5em;
    font-size: inherit;
    color: inherit;
  }

  .badge-label {
    min-width: 0;
    overflow-wrap: anywhere;
  }
`,m="#0057FF",u="#EAF4FF";function p(e,s){const r=typeof e=="string"?e.trim():"";return/^#(?:[\da-f]{3}|[\da-f]{4}|[\da-f]{6}|[\da-f]{8})$/i.test(r)?r:s}function l({iconName:e="LocalHospital",label:s="Medical",foregroundColor:r=m,backgroundColor:v=u}){const i=typeof e=="string"?e.trim():"",d=Object.prototype.hasOwnProperty.call(c,i)?c[i]:void 0;return o.jsxs(j,{style:{color:p(r,m),backgroundColor:p(v,u)},children:[d&&o.jsx(d,{"aria-hidden":"true",focusable:"false",className:"badge-icon"}),o.jsx("span",{className:"badge-label",children:s})]})}l.__docgenInfo={description:"",methods:[],displayName:"Badge",props:{iconName:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:"'LocalHospital'",computed:!1}},label:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:"'Medical'",computed:!1}},foregroundColor:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:"'#0057FF'",computed:!1}},backgroundColor:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:"'#EAF4FF'",computed:!1}}}};const T={title:"CustomUI/Badge",component:l,tags:["autodocs"],args:{iconName:"LocalHospital",label:"Medical",foregroundColor:"#0057FF",backgroundColor:"#EAF4FF"},argTypes:{iconName:{control:"text"},label:{control:"text"},foregroundColor:{control:"color"},backgroundColor:{control:"color"}}},a={args:{iconName:"Email",label:"Email",foregroundColor:"#168447",backgroundColor:"#E6F8EE"}},t={args:{iconName:"Favorite",label:"Favourite",foregroundColor:"#EC008C",backgroundColor:"#FCE4F2"}},n={render:()=>o.jsx("div",{style:{display:"grid",justifyItems:"start",gap:"0.75rem"},children:o.jsx(l,{})})};var g,f,F;a.parameters={...a.parameters,docs:{...(g=a.parameters)==null?void 0:g.docs,source:{originalSource:`{
  args: {
    iconName: 'Email',
    label: 'Email',
    foregroundColor: '#168447',
    backgroundColor: '#E6F8EE'
  }
}`,...(F=(f=a.parameters)==null?void 0:f.docs)==null?void 0:F.source}}};var b,C,E;t.parameters={...t.parameters,docs:{...(b=t.parameters)==null?void 0:b.docs,source:{originalSource:`{
  args: {
    iconName: 'Favorite',
    label: 'Favourite',
    foregroundColor: '#EC008C',
    backgroundColor: '#FCE4F2'
  }
}`,...(E=(C=t.parameters)==null?void 0:C.docs)==null?void 0:E.source}}};var y,h,x;n.parameters={...n.parameters,docs:{...(y=n.parameters)==null?void 0:y.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'grid',
    justifyItems: 'start',
    gap: '0.75rem'
  }}>
      <Badge />
    </div>
}`,...(x=(h=n.parameters)==null?void 0:h.docs)==null?void 0:x.source}}};const A=["Email","Favourite","Medical"];export{a as Email,t as Favourite,n as Medical,A as __namedExportsOrder,T as default};
