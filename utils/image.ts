/**
 * Otimiza imagens do Supabase Storage utilizando a API de Image Transformation.
 * Requer Plano Pro no Supabase para funcionar corretamente com redimensionamento.
 * 
 * @param url A URL original da imagem (public)
 * @param width A largura desejada em pixels
 * @param height A altura desejada em pixels (opcional)
 * @param quality Qualidade da imagem (0-100), padrão 80
 */
export const getOptimizedImageUrl = (url: string | undefined, width: number, height?: number, quality = 80): string => {
    if (!url) return '';
  
    // Verifica se é uma URL pública do Supabase Storage
    // Transformações não funcionam em URLs assinadas (signed urls) ou externas
    if (url.includes('supabase.co') && url.includes('/storage/v1/object/public/')) {
      try {
        // Substitui o endpoint de 'object' para 'render/image'
        // De: .../storage/v1/object/public/...
        // Para: .../storage/v1/render/image/public/...
        const baseUrl = url.replace('/storage/v1/object/public/', '/storage/v1/render/image/public/');
        
        const params = new URLSearchParams();
        params.append('width', width.toString());
        if (height) params.append('height', height.toString());
        params.append('quality', quality.toString());
        params.append('resize', 'contain'); // ou 'cover', dependendo da necessidade
  
        return `${baseUrl}?${params.toString()}`;
      } catch (e) {
        return url;
      }
    }
  
    // Retorna a URL original se não for do Supabase ou se for assinada
    return url;
  };