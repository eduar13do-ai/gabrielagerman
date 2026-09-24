/**
 * GABRIELA GERMAN - LUXURY LINK IN BIO INTERACTION SCRIPT
 */

document.addEventListener('DOMContentLoaded', () => {
  initSparklesCanvas();
  initModals();
  initQuiz();
  initVideoPlayer();
  initShareButton();
});

/* ==========================================================================
   1. GOLDEN SPARKLES CANVAS BACKGROUND
   ========================================================================== */
function initSparklesCanvas() {
  const canvas = document.getElementById('sparkles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const particleCount = 28;

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 0.5,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: -Math.random() * 0.4 - 0.1,
      opacity: Math.random() * 0.6 + 0.2,
      pulse: Math.random() * 0.05 + 0.01,
      increasing: Math.random() > 0.5
    });
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach((p) => {
      p.x += p.speedX;
      p.y += p.speedY;

      if (p.increasing) {
        p.opacity += p.pulse;
        if (p.opacity >= 0.8) p.increasing = false;
      } else {
        p.opacity -= p.pulse;
        if (p.opacity <= 0.1) p.increasing = true;
      }

      if (p.y < 0) p.y = height;
      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(245, 215, 150, ${p.opacity})`;
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#dfba73';
      ctx.fill();
    });

    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   2. MODAL CONTROLLERS
   ========================================================================== */
function initModals() {
  const modalConfigs = [
    { triggerId: 'quiz-trigger-btn', modalId: 'quiz-modal', closeId: 'close-quiz-btn' },
    { triggerId: 'cursos-btn', modalId: 'cursos-modal', closeId: 'close-cursos-btn' },
    { triggerId: 'mentoria-btn', modalId: 'mentoria-modal', closeId: 'close-mentoria-btn' },
    { triggerId: 'atendimentos-btn', modalId: 'atendimentos-modal', closeId: 'close-atendimentos-btn' },
    { triggerId: 'video-aulas-btn', modalId: 'video-modal', closeId: 'close-video-btn' },
    { triggerId: 'produtos-btn', modalId: 'produtos-modal', closeId: 'close-produtos-btn' },
    { triggerId: 'studio-btn', modalId: 'atendimentos-modal', closeId: 'close-atendimentos-btn' },
  ];

  modalConfigs.forEach(({ triggerId, modalId, closeId }) => {
    const trigger = document.getElementById(triggerId);
    const modal = document.getElementById(modalId);
    const closeBtn = document.getElementById(closeId);

    if (trigger && modal) {
      trigger.addEventListener('click', () => {
        openModal(modal);
      });
    }

    if (closeBtn && modal) {
      closeBtn.addEventListener('click', () => {
        closeModal(modal);
      });
    }

    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          closeModal(modal);
        }
      });
    }
  });

  // ESC key to close any open modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.active').forEach(closeModal);
    }
  });
}

function openModal(modal) {
  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';

  // Pause video if modal is closing
  const video = modal.querySelector('video');
  if (video) {
    video.pause();
  }
}

/* ==========================================================================
   3. INTERACTIVE QUIZ ENGINE
   ========================================================================== */
const quizQuestions = [
  {
    step: 1,
    title: 'Qual é o seu objetivo principal agora?',
    desc: 'Selecione para entender sua real necessidade:',
    options: [
      { text: 'Aprender Nail Design do Zero (Iniciante)', next: 1, category: 'curso_iniciante' },
      { text: 'Aperfeiçoar minhas técnicas e cobrar mais caro', next: 1, category: 'especializacao' },
      { text: 'Acelerar faturamento e lotar agenda (Mentoria)', next: 1, category: 'mentoria' },
      { text: 'Quero agendar um atendimento de luxo para minhas unhas', next: 2, category: 'cliente' }
    ]
  },
  {
    step: 2,
    title: 'Qual é o seu momento profissional atual?',
    desc: 'Conte um pouco sobre sua rotina atual:',
    options: [
      { text: 'Ainda não atendo clientes, quero começar', next: 2, val: 'zero' },
      { text: 'Já atendo em casa / domicílio', next: 2, val: 'casa' },
      { text: 'Já tenho meu espaço ou trabalho em salão', next: 2, val: 'salao' },
      { text: 'Quero abrir meu próprio estúdio este ano', next: 2, val: 'abrir' }
    ]
  },
  {
    step: 3,
    title: 'Qual formato você busca?',
    desc: 'Como prefere dar este próximo passo?',
    options: [
      { text: 'Curso Presencial VIP (Treinamento prático 1 a 1)', result: 'presencial' },
      { text: 'Formação Online com Acesso Imediato', result: 'online' },
      { text: 'Mentoria Individual de Negócios & Posicionamento', result: 'mentoria_vip' },
      { text: 'Agendamento de Procedimento VIP (Cliente)', result: 'atendimento_vip' }
    ]
  }
];

let currentStep = 0;
let userAnswers = [];

function initQuiz() {
  const container = document.getElementById('quiz-options-container');
  const restartBtn = document.getElementById('restart-quiz-btn');

  if (restartBtn) {
    restartBtn.addEventListener('click', resetQuiz);
  }

  renderQuizStep();
}

function renderQuizStep() {
  const q = quizQuestions[currentStep];
  const stepIndicator = document.getElementById('quiz-step-indicator');
  const title = document.getElementById('quiz-step-title');
  const desc = document.getElementById('quiz-step-desc');
  const progressBar = document.getElementById('quiz-progress-bar');
  const optionsContainer = document.getElementById('quiz-options-container');
  const resultContainer = document.getElementById('quiz-result-container');

  if (!q) {
    showQuizResult();
    return;
  }

  stepIndicator.innerText = `Pergunta ${currentStep + 1} de ${quizQuestions.length}`;
  title.innerText = q.title;
  desc.innerText = q.desc;
  progressBar.style.width = `${((currentStep + 1) / quizQuestions.length) * 100}%`;

  optionsContainer.style.display = 'flex';
  resultContainer.style.display = 'none';
  optionsContainer.innerHTML = '';

  q.options.forEach((opt) => {
    const btn = document.createElement('button');
    btn.className = 'quiz-option-btn';
    btn.innerHTML = `<span>${opt.text}</span> <i class="fa-solid fa-arrow-right"></i>`;
    btn.addEventListener('click', () => {
      userAnswers.push(opt);
      currentStep++;
      renderQuizStep();
    });
    optionsContainer.appendChild(btn);
  });
}

function showQuizResult() {
  const optionsContainer = document.getElementById('quiz-options-container');
  const resultContainer = document.getElementById('quiz-result-container');
  const resultTitle = document.getElementById('result-title');
  const resultText = document.getElementById('result-text');
  const resultBox = document.getElementById('result-box');
  const waBtn = document.getElementById('result-whatsapp-btn');
  const stepIndicator = document.getElementById('quiz-step-indicator');
  const title = document.getElementById('quiz-step-title');
  const desc = document.getElementById('quiz-step-desc');

  stepIndicator.innerText = 'DIAGNÓSTICO CONCLUÍDO ✨';
  title.innerText = 'Seu Próximo Passo Ideal';
  desc.innerText = 'Com base nas suas respostas, aqui está a recomendação personalizada:';

  optionsContainer.style.display = 'none';
  resultContainer.style.display = 'block';

  // Determine recommendation
  const lastChoice = userAnswers[userAnswers.length - 1];
  let planName = 'Formação Presencial VIP Gabriela German';
  let planDesc = 'O método definitivo para você dominar as técnicas mais desejadas e lucrativas com acompanhamento prático.';
  let waMsg = 'Olá Gabriela! Fiz o quiz no seu link da bio e meu objetivo é: ' + (userAnswers[0]?.text || 'Crescer na carreira');

  if (lastChoice?.result === 'mentoria_vip' || userAnswers[0]?.category === 'mentoria') {
    planName = 'Mentoria VIP de Negócios & Alto Padrão';
    planDesc = 'Aceleração estratégica 1 a 1 para elevar seu faturamento, ajustar seu posicionamento e dobrar seus preços com segurança.';
    waMsg = 'Olá Gabriela! Fiz o teste no seu link da bio e tenho interesse em aplicar para a sua Mentoria VIP!';
  } else if (lastChoice?.result === 'atendimento_vip' || userAnswers[0]?.category === 'cliente') {
    planName = 'Agendamento no Espaço Gabriela German';
    planDesc = 'Alongamento estruturado, blindagem diamante ou manutenção em ambiente exclusivo com padrão premium.';
    waMsg = 'Olá Gabriela! Gostaria de verificar os horários disponíveis para agendar meu procedimento no seu espaço!';
  } else if (lastChoice?.result === 'online') {
    planName = 'Especializações & Masterclasses Online';
    planDesc = 'Acesso às técnicas de precisão com certificado, suporte a dúvidas e flexibilidade para estudar onde estiver.';
    waMsg = 'Olá Gabriela! Gostaria de receber o link e detalhes dos seus cursos online com acesso imediato!';
  }

  resultTitle.innerText = planName;
  resultText.innerText = 'Recomendado para o seu perfil e momento atual:';
  resultBox.innerHTML = `
    <h5>${planName}</h5>
    <p>${planDesc}</p>
  `;

  waBtn.href = `https://wa.me/5500000000000?text=${encodeURIComponent(waMsg)}`;
}

function resetQuiz() {
  currentStep = 0;
  userAnswers = [];
  renderQuizStep();
}

/* ==========================================================================
   4. VIDEO PLAYER TAB SWITCHER
   ========================================================================== */
function initVideoPlayer() {
  const tabs = document.querySelectorAll('.video-tab-btn');
  const videoPlayer = document.getElementById('active-video-player');
  const caption = document.getElementById('video-caption-text');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      const videoSrc = tab.getAttribute('data-video');
      if (videoPlayer && videoSrc) {
        videoPlayer.src = videoSrc;
        videoPlayer.load();
        videoPlayer.play().catch(() => {});

        if (caption) {
          caption.innerText =
            videoSrc.includes('sirena')
              ? 'Demonstração detalhada do passo a passo do Efeito Sirena.'
              : 'Mini Aula Técnica: acabamento perfeito e controle de produto.';
        }
      }
    });
  });
}

/* ==========================================================================
   5. SHARE BUTTON & TOAST NOTIFICATION
   ========================================================================== */
function initShareButton() {
  const shareBtn = document.getElementById('share-btn');
  if (!shareBtn) return;

  shareBtn.addEventListener('click', async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Gabriela German | Nail Designer & Mentora',
          text: 'Confira os cursos, atendimentos e mentorias exclusivas de Gabriela German.',
          url: window.location.href
        });
      } catch (err) {
        copyPageUrl();
      }
    } else {
      copyPageUrl();
    }
  });
}

function copyPageUrl() {
  navigator.clipboard.writeText(window.location.href).then(() => {
    showToast('✨ Link copiado para a área de transferência!');
  }).catch(() => {
    showToast('Link da bio: ' + window.location.href);
  });
}

function showToast(message) {
  const toast = document.getElementById('toast-message');
  if (!toast) return;

  toast.innerText = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

// Global handler for VIP Form
window.handleNotifySubmit = function() {
  const nameInput = document.getElementById('notify-name');
  const name = nameInput ? nameInput.value : '';
  showToast(`🎉 Obrigada, ${name || 'Nail Designer'}! Você está na lista VIP.`);
  
  const modal = document.getElementById('produtos-modal');
  if (modal) {
    setTimeout(() => {
      closeModal(modal);
    }, 1500);
  }
};
