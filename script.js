(function(){
  const DRIVE_SHARE="https://drive.google.com/file/d/1ujGurPE9SyqHnY8xnSkjBVz8Y-aF0zSx/view?usp=sharing";
  const iframe=document.getElementById("videoIframe");
  const yearEl=document.getElementById("year");

  function convertDrivePreview(url){
    try{
      const m=url.match(/\/d\/([a-zA-Z0-9_-]{10,})/);
      if(m&&m[1])return `https://drive.google.com/file/d/${m[1]}/preview`;
      const q=new URL(url);
      if(q.searchParams&&q.searchParams.get('id'))return `https://drive.google.com/file/d/${q.searchParams.get('id')}/preview`;
    }catch(e){}
    return url;
  }

  iframe.src=convertDrivePreview(DRIVE_SHARE);
  yearEl.textContent=new Date().getFullYear();
})();
