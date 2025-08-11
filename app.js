// app.js

// Helper: get reports from localStorage
function getReports(){
    const raw = localStorage.getItem('zefas_reports');
    return raw ? JSON.parse(raw) : [];
  }
  
  function saveReports(arr){
    localStorage.setItem('zefas_reports', JSON.stringify(arr));
  }
  
  // Handle report form (in report.html)
  document.addEventListener('DOMContentLoaded', function(){
    const reportForm = document.getElementById('reportForm');
    if(reportForm){
      reportForm.addEventListener('submit', function(e){
        e.preventDefault();
        const title = document.getElementById('title').value.trim();
        const description = document.getElementById('description').value.trim();
        const incidentDate = document.getElementById('incidentDate').value || null;
        const evidence = document.getElementById('evidence').value.trim();
        const reporterName = document.getElementById('reporterName').value.trim();
        const reporterEmail = document.getElementById('reporterEmail').value.trim();
  
        if(!title || !description){
          document.getElementById('formMessage').textContent = 'المرجو ملء الحقول المطلوبة.';
          return;
        }
  
        const reports = getReports();
        const newReport = {
          id: 'r_' + Date.now(),
          title,
          description,
          incidentDate,
          evidence,
          reporterName,
          reporterEmail,
          createdAt: new Date().toISOString()
        };
        reports.unshift(newReport);
        saveReports(reports);
  
        // رسالة نجاح
        document.getElementById('formMessage').textContent = 'تم حفظ البلاغ محليًا بنجاح. (تستطيع ربط الموقع بخادم لإرسال البلاغات فعليًا)';
        reportForm.reset();
      });
    }
  
    // Admin page logic
    const loginBtn = document.getElementById('loginBtn');
    if(loginBtn){
      const adminArea = document.getElementById('adminArea');
      const loginMsg = document.getElementById('loginMsg');
  
      loginBtn.addEventListener('click', function(){
        const pass = document.getElementById('adminPass').value;
        // تحذير: هذه طريقة حماية مؤقتة فقط للعرض!
        const ADMIN_PASS = 'Ilyaass12345'; // غيّرها عندك
        if(pass === ADMIN_PASS){
          document.getElementById('adminPass').value = '';
          loginMsg.textContent = '';
          adminArea.style.display = 'block';
          renderReportsTable();
        } else {
          loginMsg.textContent = 'كلمة المرور خاطئة.';
        }
      });
  
      document.getElementById('clearReports').addEventListener('click', function(){
        if(confirm('هل ترغب فعلاً في حذف كل البلاغات (محليًا)؟')){
          localStorage.removeItem('zefas_reports');
          renderReportsTable();
        }
      });
    }
  
    // Render reports in admin
    function renderReportsTable(){
      const tbody = document.querySelector('#reportsTable tbody');
      if(!tbody) return;
      const reports = getReports();
      tbody.innerHTML = '';
      if(reports.length === 0){
        tbody.innerHTML = '<tr><td colspan="5" class="small">لا توجد بلاغات محفوظة</td></tr>';
        return;
      }
      reports.forEach(r=>{
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${new Date(r.createdAt).toLocaleString('ar-EG')}</td>
          <td>${escapeHtml(r.title)}</td>
          <td>${escapeHtml(r.description).slice(0,200)}${r.description.length>200?'...':''}</td>
          <td>${escapeHtml(r.reporterName || 'مجهول')}</td>
          <td>${escapeHtml(r.reporterEmail || '-')}</td>
        `;
        tbody.appendChild(tr);
      });
    }
  
    // simple escaper
    function escapeHtml(str){
      if(!str) return '';
      return str.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
    }
  });

  
