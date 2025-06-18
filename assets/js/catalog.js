document.addEventListener('DOMContentLoaded', () => {
  // Get DOM elements
  const searchInput = document.getElementById('searchInput');
  const categoryFilter = document.getElementById('categoryFilter');
  const priceFilter = document.getElementById('priceFilter');
  const typeFilter = document.getElementById('typeFilter');
  const clearFiltersBtn = document.getElementById('clearFilters');
  const productsGrid = document.getElementById('productsGrid');
  const noResults = document.getElementById('noResults');
  const productCards = document.querySelectorAll('.product-card');

  // Initialize product animations
  initializeProductAnimations();

  // Search functionality
  searchInput.addEventListener('input', debounce(filterProducts, 300));

  // Filter functionality
  categoryFilter.addEventListener('change', filterProducts);
  priceFilter.addEventListener('change', filterProducts);
  typeFilter.addEventListener('change', filterProducts);

  // Clear filters
  clearFiltersBtn.addEventListener('click', clearAllFilters);

  // Add to cart functionality
  document.querySelectorAll('.btn-add-cart').forEach(button => {
    button.addEventListener('click', handleAddToCart);
  });

  function initializeProductAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('loaded');
          entry.target.classList.remove('loading');
        }
      });
    }, observerOptions);

    productCards.forEach(card => {
      card.classList.add('loading');
      observer.observe(card);
    });
  }

  function filterProducts() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const selectedCategory = categoryFilter.value;
    const selectedPrice = priceFilter.value;
    const selectedType = typeFilter.value;

    let visibleCount = 0;

    productCards.forEach(card => {
      const productName = card.querySelector('h3').textContent.toLowerCase();
      const productDescription = card.querySelector('.product-description')?.textContent.toLowerCase() || '';
      const productCategory = card.dataset.category;
      const productPrice = parseFloat(card.dataset.price);
      const productType = card.dataset.type;

      // Search filter
      const matchesSearch = searchTerm === '' || 
        productName.includes(searchTerm) || 
        productDescription.includes(searchTerm);

      // Category filter
      const matchesCategory = selectedCategory === 'all' || productCategory === selectedCategory;

      // Price filter
      let matchesPrice = true;
      if (selectedPrice !== 'all') {
        const [min, max] = selectedPrice.split('-').map(p => p.replace('+', ''));
        if (max) {
          matchesPrice = productPrice >= parseFloat(min) && productPrice <= parseFloat(max);
        } else {
          matchesPrice = productPrice >= parseFloat(min);
        }
      }

      // Type filter
      const matchesType = selectedType === 'all' || productType === selectedType;

      // Show/hide product
      if (matchesSearch && matchesCategory && matchesPrice && matchesType) {
        showProduct(card);
        visibleCount++;
      } else {
        hideProduct(card);
      }
    });

    // Show/hide no results message
    if (visibleCount === 0) {
      noResults.style.display = 'block';
      productsGrid.style.display = 'none';
    } else {
      noResults.style.display = 'none';
      productsGrid.style.display = 'grid';
    }

    // Update URL with current filters (optional)
    updateURL();
  }

  function showProduct(card) {
    card.style.display = 'block';
    card.classList.remove('filtered-out');
    card.classList.add('filtered-in');
  }

  function hideProduct(card) {
    card.classList.remove('filtered-in');
    card.classList.add('filtered-out');
    
    // Hide after animation
    setTimeout(() => {
      if (card.classList.contains('filtered-out')) {
        card.style.display = 'none';
      }
    }, 300);
  }

  function clearAllFilters() {
    searchInput.value = '';
    categoryFilter.value = 'all';
    priceFilter.value = 'all';
    typeFilter.value = 'all';
    
    // Show all products
    productCards.forEach(card => {
      showProduct(card);
    });
    
    noResults.style.display = 'none';
    productsGrid.style.display = 'grid';
    
    // Clear URL parameters
    updateURL();
    
    // Add visual feedback
    clearFiltersBtn.style.transform = 'scale(0.95)';
    setTimeout(() => {
      clearFiltersBtn.style.transform = 'scale(1)';
    }, 150);
  }

  function handleAddToCart(event) {
    const button = event.target;
    const productCard = button.closest('.product-card');
    const productName = productCard.querySelector('h3').textContent;
    const productPrice = productCard.querySelector('.product-price').textContent;
    
    // Add loading state
    const originalText = button.textContent;
    button.textContent = 'Processando...';
    button.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
      // Reset button
      button.textContent = originalText;
      button.disabled = false;
      
      // Show success feedback
      showNotification(`${productName} adicionado! Entre em contato via WhatsApp para finalizar o pedido.`);
      
      // Optional: Open WhatsApp with pre-filled message
      const message = encodeURIComponent(`Olá! Gostaria de fazer um pedido:\n\n📦 Produto: ${productName}\n💰 Preço: ${productPrice}\n\nPor favor, me ajude a finalizar a compra!`);
      const whatsappUrl = `https://wa.me/48999620593?text=${message}`;
      
      // Ask user if they want to open WhatsApp
      if (confirm('Produto selecionado! Deseja abrir o WhatsApp para finalizar o pedido?')) {
        window.open(whatsappUrl, '_blank');
      }
    }, 1000);
  }

  function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
      <div class="notification-content">
        <span class="notification-icon">✅</span>
        <span class="notification-message">${message}</span>
        <button class="notification-close">&times;</button>
      </div>
    `;
    
    // Add styles
    notification.style.cssText = `
      position: fixed;
      top: 100px;
      right: 20px;
      background: linear-gradient(135deg, var(--gold), #e6c200);
      color: var(--black);
      padding: 15px 20px;
      border-radius: 10px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.3);
      z-index: 10000;
      max-width: 400px;
      transform: translateX(100%);
      transition: transform 0.3s ease;
      font-weight: 600;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Close functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    });
    
    // Auto close after 5 seconds
    setTimeout(() => {
      if (document.body.contains(notification)) {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
          if (document.body.contains(notification)) {
            document.body.removeChild(notification);
          }
        }, 300);
      }
    }, 5000);
  }

  function updateURL() {
    const params = new URLSearchParams();
    
    if (searchInput.value) params.set('search', searchInput.value);
    if (categoryFilter.value !== 'all') params.set('category', categoryFilter.value);
    if (priceFilter.value !== 'all') params.set('price', priceFilter.value);
    if (typeFilter.value !== 'all') params.set('type', typeFilter.value);
    
    const newUrl = params.toString() ? 
      `${window.location.pathname}?${params.toString()}` : 
      window.location.pathname;
    
    window.history.replaceState({}, '', newUrl);
  }

  function loadFiltersFromURL() {
    const params = new URLSearchParams(window.location.search);
    
    if (params.get('search')) searchInput.value = params.get('search');
    if (params.get('category')) categoryFilter.value = params.get('category');
    if (params.get('price')) priceFilter.value = params.get('price');
    if (params.get('type')) typeFilter.value = params.get('type');
    
    // Apply filters if any were loaded
    if (params.toString()) {
      filterProducts();
    }
  }

  // Debounce function for search
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Load filters from URL on page load
  loadFiltersFromURL();

  // Add smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Add product card hover effects
  productCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0) scale(1)';
    });
  });

  // Add keyboard navigation for filters
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      searchInput.blur();
    }
    
    if (e.ctrlKey && e.key === 'k') {
      e.preventDefault();
      searchInput.focus();
    }
  });

  // Add loading states for filter changes
  [categoryFilter, priceFilter, typeFilter].forEach(filter => {
    filter.addEventListener('change', () => {
      productsGrid.style.opacity = '0.7';
      setTimeout(() => {
        productsGrid.style.opacity = '1';
      }, 200);
    });
  });
});
