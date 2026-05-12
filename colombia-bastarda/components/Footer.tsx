import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-white py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="font-bold mb-4">Colombia Bastarda</h3>
            <p className="text-gray-400">Una revista web moderna sobre cultura, arte y resistencia en Colombia.</p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Secciones</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/articles" className="hover:text-white transition-colors">Artículos</Link></li>
              <li><Link href="/events" className="hover:text-white transition-colors">Eventos</Link></li>
              <li><Link href="/editions" className="hover:text-white transition-colors">Ediciones</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Síguenos</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.014-.607 1.794-1.35 2.203-2.382-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.054 0 14.007-7.496 13.991-13.986.002-.223.01-.447.01-.672 0-1.492-.01-2.97-.02-4.452z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.675 0h-15.35c-2.478 0-4.488 2.01-4.488 4.488v15.025c0 2.477 2.01 4.487 4.488 4.487h15.35c2.477 0 4.487-2.01 4.487-4.488v-15.025c0-2.478-2.01-4.488-4.487-4.488zM12 14.25c-2.485 0-4.5-2.015-4.5-4.5s2.015-4.5 4.5-4.5 4.5 2.015 4.5 4.5-2.015 4.5-4.5 4.5zm0-9.5c-1.38 0-2.5 1.12-2.5 2.5s1.12 2.5 2.5 2.5 2.5-1.12 2.5-2.5-1.12-2.5-2.5-2.5z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 2.557a9.83 9.83 0 0 1-2.828.775 4.932 4.932 0 0 0 2.172-2.723c-.951.564-2.005.974-3.127 1.195a4.92 4.92 0 0 0 8.354-6.187c-2.642 1.424-5.566 2.85-8.736 3.946a4.93 4.93 0 0 0-2.251-6.022c-2.293 1.527-5.047 3.304-8.03 3.753a14.95 14.95 0 0 1-7.099 4.09c6.105 3.617 13.378 5.75 21.17 5.75a9.91 9.91 0 0 0 6.226-2.188c-2.073 1.574-4.598 2.492-7.277 2.492a4.93 4.93 0 0 0 3.462-1.312 4.933 4.933 0 0 1-3.18 1.765A4.918 4.918 0 0 0 5.137 2.45a4.918 4.918 0 0 0-2.431 6.677c-1.578.415-3.265.668-4.837.668v.05a4.923 4.923 0 0 0 3.946 4.826c-.976.217-2.005.334-3.06.266a14.906 14.906 0 0 1 10.074 5.646c11.559 0 17.884-9.579 17.884-17.874 0-.273-.006-.545-.014-.818a9.945 9.945 0 0 0 2.46-2.377c-.516 1.441-.899 3.047-1.088 4.678z"/>
                </svg>
              </a>
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-4">Newsletter</h4>
            <form className="flex space-x-2">
              <input
                type="email"
                placeholder="Tu correo electrónico"
                className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-l text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600"
              />
              <button type="submit" className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-r">
                Suscribirse
              </button>
            </form>
          </div>
        </div>
        <div className="mt-8 pt-4 border-t border-gray-800 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Colombia Bastarda. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}