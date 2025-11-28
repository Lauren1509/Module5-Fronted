"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Search, TrendingUp } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { StatsCharts } from "@/components/stats-charts"
import { StatsTable } from "@/components/stats-table"

interface URLStats {
  code: string
  longUrl: string
  totalClicks: number
  createdAt: string
  lastClickAt: string | null
  clicksByDate: { date: string; clicks: number }[]
  clicksByCountry: { country: string; clicks: number }[]
  clicksByDevice: { device: string; clicks: number }[]
  clicksByReferrer: { referrer: string; clicks: number }[]
}

export default function StatsDashboardPage() {
  const [urlCode, setUrlCode] = useState("")
  const [stats, setStats] = useState<URLStats | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const code = urlCode.trim()

    if (!code) {
      toast({
        variant: "destructive",
        title: "Código requerido",
        description: "Ingresa el código de la URL corta (ej: 9r0CTc).",
      })
      return
    }

    try {
      setIsLoading(true)
      setStats(null)

      // Llamamos a la API interna de Next que a su vez llama al API Gateway
      const res = await fetch(`/api/stats/${encodeURIComponent(code)}`)
      const data = await res.json()

      if (!res.ok) {
        toast({
          variant: "destructive",
          title: "Error al obtener estadísticas",
          description: data?.error ?? "Intenta nuevamente en unos minutos.",
        })
        return
      }

      setStats(data)
    } catch (error) {
      console.error(error)
      toast({
        variant: "destructive",
        title: "Error inesperado",
        description: "Ocurrió un error al consultar las estadísticas.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-50">
      <div className="container mx-auto px-4 py-10 space-y-8">
        {/* Header */}
        <header className="space-y-2 text-center">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            URL Analytics Dashboard
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Consulta las estadísticas de las URLs cortas generadas por tu sistema:
            clicks totales, actividad por fecha, país, dispositivo y más.
          </p>
        </header>

        {/* Search Card */}
        <Card className="max-w-2xl mx-auto border-slate-800 bg-slate-900/70 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-sky-400" />
              Buscar estadísticas
            </CardTitle>
            <CardDescription>
              Ingresa el código de la URL corta (el que está al final del enlace).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-3"
            >
              <Input
                placeholder="Ej: 9r0CTc"
                value={urlCode}
                onChange={(e) => setUrlCode(e.target.value)}
                className="flex-1"
              />
              <Button
                type="submit"
                disabled={isLoading}
                className="min-w-[120px]"
              >
                {isLoading ? "Buscando..." : "Ver stats"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Content */}
        <div className="space-y-6">
          {stats ? (
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList className="bg-slate-900/70 border border-slate-800">
                <TabsTrigger value="overview">Resumen</TabsTrigger>
                <TabsTrigger value="charts">Gráficas</TabsTrigger>
                <TabsTrigger value="table">Detalle</TabsTrigger>
              </TabsList>

              {/* Overview */}
              <TabsContent value="overview" className="space-y-4">
                <Card className="border-slate-800 bg-slate-900/70 backdrop-blur">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-emerald-400" />
                      Resumen general
                    </CardTitle>
                    <CardDescription>
                      Información principal de la URL corta seleccionada.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-1">
                      <p className="text-xs uppercase text-muted-foreground">
                        URL original
                      </p>
                      <p className="text-sm break-all">{stats.longUrl}</p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-xs uppercase text-muted-foreground">
                        Código
                      </p>
                      <p className="text-lg font-semibold">{stats.code}</p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-xs uppercase text-muted-foreground">
                        Total de clicks
                      </p>
                      <p className="text-2xl font-bold text-emerald-400">
                        {stats.totalClicks}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-xs uppercase text-muted-foreground">
                        Último click
                      </p>
                      <p className="text-sm">
                        {stats.lastClickAt
                          ? new Date(stats.lastClickAt).toLocaleString()
                          : "Sin registros aún"}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Charts */}
              <TabsContent value="charts">
                <StatsCharts stats={stats} />
              </TabsContent>

              {/* Table */}
              <TabsContent value="table">
                <StatsTable stats={stats} />
              </TabsContent>
            </Tabs>
          ) : (
            <Card className="border-slate-800 bg-slate-900/70 backdrop-blur">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <TrendingUp className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  No hay estadísticas para mostrar
                </h3>
                <p className="text-muted-foreground max-w-md">
                  Ingresa un código de URL corta arriba para ver las estadísticas
                  detalladas de clicks, países, dispositivos y más.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
