import React from 'react'
import FooterContent from './footer-content'
import FooterMovil from '@/components/clinica/footer-movil'
import { auth } from '@/lib/auth'

const DashCodeFooter = async () => {
    const session = await auth()
    const inicial = (session?.user?.name ?? session?.user?.email ?? '?').charAt(0)
    return (
        <FooterContent>
            <div className=' md:flex  justify-between text-default-600 hidden'>
                <div className="text-center ltr:md:text-start rtl:md:text-right text-sm">
                    &copy; {new Date().getFullYear()} XelaHealing — Sistema de gestión clínica
                </div>
                <div className="ltr:md:text-right rtl:md:text-end text-center text-sm">
                    UMES · Quetzaltenango
                </div>
            </div>
            <FooterMovil inicial={inicial} />
        </FooterContent>
    )
}

export default DashCodeFooter
