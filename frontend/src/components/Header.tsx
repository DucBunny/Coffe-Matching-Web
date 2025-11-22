import { Link } from '@tanstack/react-router'
import { CheckCircle2, Search, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-[#FF6347] shadow-md">
      <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-6">
        {/* Logo Section */}
        <Link 
          to="/" 
          className="flex items-center gap-2 font-bold text-xl text-white hover:opacity-90 transition-opacity"
        >
          <div className="flex items-center justify-center w-10 h-10 bg-white/10 rounded-lg backdrop-blur-sm">
            <span className="text-white text-lg">☕</span>
          </div>
          <span className="hidden sm:inline-block">Coffee Match</span>
        </Link>

        {/* Search Bar */}
        <div className="flex-1 max-w-2xl relative">
          <Input
            type="text"
            placeholder="何をお探しですか？"
            className="h-10 pr-10 bg-white/95 backdrop-blur-sm border-white/30 focus-visible:border-white focus-visible:ring-white/30 placeholder:text-gray-500"
          />
          <Button
            size="icon-sm"
            variant="ghost"
            className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800 hover:bg-transparent"
          >
            <Search size={18} />
          </Button>
        </div>

        {/* Right Section - Navigation */}
        <div className="flex items-center gap-2">
          {/* Finished Items Button */}
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="text-white hover:bg-white/20 hover:text-white gap-2 hidden md:flex"
          >
            <Link to="/">
              <CheckCircle2 size={16} />
              <span className="text-sm">終了済み</span>
            </Link>
          </Button>

          {/* User Login/Profile */}
          <Button
            variant="outline"
            size="sm"
            asChild
            className="bg-white text-[#FF6347] border-white hover:bg-white/90 hover:text-[#FF6347] gap-2"
          >
            <Link to="/login">
              <User size={16} />
              <span className="hidden sm:inline-block">ログイン</span>
            </Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
