import React from 'react';

const Historia = () => {
  const historias = [
    {
      title: 'La Cocina Prehispánica Tlaxcalteca',
      period: 'Siglo XII a.C. – 1521 d.C.',
      content: 'La gastronomía tlaxcalteca hunde sus raíces en las culturas olmeco-xicalancas y más tarde en los señoríos tlaxcaltecas independientes. El maíz en sus variedades azul, negro, rojo y blanco fue la base de la alimentación: tortillas, tamales, atoles y pozoles dominaban la dieta cotidiana. El maguey era planta sagrada: daba pulque, agua miel, fibras y alimento. Los hongos silvestres, el xoconostle, el epazote y los quelites completaban una dieta rica y equilibrada.',
      highlight: 'Tlaxcala fue el único estado de México que nunca fue conquistado por los aztecas, lo que preservó una gastronomía propia única, sin influencias mexicas directas.'
    },
    {
      title: 'El Encuentro con los Españoles y la Cocina Nueva',
      period: '1521 – 1600',
      content: 'La alianza de Tlaxcala con Hernán Cortés cambió para siempre la historia y la gastronomía de la región. Los tlaxcaltecas adoptaron el cerdo, la res, el trigo y nuevas especias, fusionándolos con técnicas culinarias ancestrales. Nacieron platillos como el mole prieto tlaxcalteca, que incorporó el chocolate y especias europeas a la base de chiles secos prehispánicos. Las cocineras tlaxcaltecas demostraron una extraordinaria creatividad para fusionar dos mundos.',
      highlight: 'El mole tlaxcalteca es anterior al mole poblano: las cocineras del convento de Santa Catalina de Siena en Tlaxcala ya preparaban versiones de este guiso antes que en Puebla.'
    },
    {
      title: 'Los Hongos y el Bosque de La Malinche',
      period: 'Tradición continua',
      content: 'El volcán La Malinche (Matlalcueitl) y los bosques de Nanacamilpa han provisto por siglos de hongos silvestres únicos a la cocina tlaxcalteca. Los clavitos, panzas, enchilados, tejamaniles y otros hongos de temporada son ingredientes protagonistas en caldos, tamales y guisos. La temporada de lluvias (julio-septiembre) convierte a Tlaxcala en un destino gastronómico privilegiado. El conocimiento para identificar y cocinar estas variedades se transmite de generación en generación.',
      highlight: 'En Nanacamilpa existe una de las colonias de luciérnagas más grandes de América, y la temporada coincide con la de hongos: el bosque tlaxcalteca celebra dos festivales naturales al mismo tiempo.'
    }
  ];

  return (
    <div className="section visible">
      <div className="section-header">
        <h2>Historia <span>Gastronómica Tlaxcalteca</span></h2>
      </div>
      <div id="historiaContent">
        {historias.map((h, i) => (
          <div key={i} style={{ marginBottom: '40px', background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px' }}>
            <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.4rem', color: 'var(--bark)', marginBottom: '8px' }}>{h.title}</h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', display: 'block', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '1px' }}>{h.period}</span>
            <p style={{ color: 'var(--text-mid)', lineHeight: '1.8', marginBottom: '16px', fontSize: '0.95rem' }}>{h.content}</p>
            <div className="history-section" style={{ background: 'var(--cream)', borderLeft: '4px solid var(--gold)', padding: '16px 20px', borderRadius: '0 10px 10px 0' }}>
              <h4 style={{ fontFamily: 'Playfair Display, serif', fontWeight: '700', color: 'var(--bark)', marginBottom: '8px' }}>💡 ¿Sabías que?</h4>
              <p style={{ color: 'var(--text-mid)', fontSize: '0.9rem', lineHeight: '1.6' }}>{h.highlight}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Historia;
