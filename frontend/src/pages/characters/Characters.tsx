import layoutStyles from "@/layouts/AuthLayout/AuthLayout.module.css"
import PageHeader from "@/components/ui/PageHeader/PageHeader";
import { useCampaign } from "@/context/campaign/useCampaign";

export default function Characters () {
  const { activeCampaign } = useCampaign()

  return (
    <div className={layoutStyles.page_container}>
      <PageHeader title="Characters" activeCampaign={activeCampaign}/>
      <h2 style={{ color: "var(--qb-periwinkle)"}}>Coming Soon...</h2>
    </div>
  )
}