import { useState, useCallback } from 'react'
import { useDisclosure } from '@heroui/react'
import {
  useSubscribersQuery,
  useSubscriberStatsQuery,
  useCampaignsQuery,
} from '@/app/tanstack-queries/newsletterQuery'
import {
  useDeleteSubscriberMutation,
  useDeleteCampaignMutation,
  useSendCampaignMutation,
} from '../mutations/useNewsletterMutations'
import type { Campaign, Subscriber } from '../types'

export type ActiveTab = 'subscribers' | 'campaigns'
export type CampaignView = 'list' | 'editor'

export function useNewsletterHook() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('subscribers')
  const [campaignView, setCampaignView] = useState<CampaignView>('list')
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null)

  // Delete subscriber modal
  const [deleteSubscriberTarget, setDeleteSubscriberTarget] =
    useState<Subscriber | null>(null)
  const {
    isOpen: isDeleteSubscriberOpen,
    onOpen: onDeleteSubscriberOpen,
    onOpenChange: onDeleteSubscriberOpenChange,
  } = useDisclosure()

  // Send campaign modal
  const [sendCampaignTarget, setSendCampaignTarget] = useState<Campaign | null>(
    null,
  )
  const {
    isOpen: isSendCampaignOpen,
    onOpen: onSendCampaignOpen,
    onOpenChange: onSendCampaignOpenChange,
  } = useDisclosure()

  // Preview modal
  const [previewCampaignId, setPreviewCampaignId] = useState<number | null>(
    null,
  )
  const {
    isOpen: isPreviewOpen,
    onOpen: onPreviewOpen,
    onOpenChange: onPreviewOpenChange,
  } = useDisclosure()

  // Queries
  const subscribersQuery = useSubscribersQuery()
  const statsQuery = useSubscriberStatsQuery()
  const campaignsQuery = useCampaignsQuery()

  // Mutations
  const deleteSubscriberMutation = useDeleteSubscriberMutation()
  const deleteCampaignMutation = useDeleteCampaignMutation()
  const sendCampaignMutation = useSendCampaignMutation()

  // ─── Subscriber actions ─────────────────────────────

  const handleDeleteSubscriberClick = useCallback(
    (subscriber: Subscriber) => {
      setDeleteSubscriberTarget(subscriber)
      onDeleteSubscriberOpen()
    },
    [onDeleteSubscriberOpen],
  )

  const handleConfirmDeleteSubscriber = useCallback(() => {
    if (deleteSubscriberTarget) {
      deleteSubscriberMutation.mutate(deleteSubscriberTarget.id, {
        onSuccess: () => onDeleteSubscriberOpenChange(),
      })
    }
  }, [
    deleteSubscriberTarget,
    deleteSubscriberMutation,
    onDeleteSubscriberOpenChange,
  ])

  // ─── Campaign actions ───────────────────────────────

  const handleCreateCampaign = useCallback(() => {
    setEditingCampaign(null)
    setCampaignView('editor')
  }, [])

  const handleEditCampaign = useCallback((campaign: Campaign) => {
    setEditingCampaign(campaign)
    setCampaignView('editor')
  }, [])

  const handleBackToList = useCallback(() => {
    setEditingCampaign(null)
    setCampaignView('list')
  }, [])

  const handleDeleteCampaignClick = useCallback(
    (campaign: Campaign) => {
      deleteCampaignMutation.mutate(campaign.id)
    },
    [deleteCampaignMutation],
  )

  const handleSendCampaignClick = useCallback(
    (campaign: Campaign) => {
      setSendCampaignTarget(campaign)
      onSendCampaignOpen()
    },
    [onSendCampaignOpen],
  )

  const handleConfirmSendCampaign = useCallback(() => {
    if (sendCampaignTarget) {
      sendCampaignMutation.mutate(sendCampaignTarget.id, {
        onSuccess: () => onSendCampaignOpenChange(),
      })
    }
  }, [sendCampaignTarget, sendCampaignMutation, onSendCampaignOpenChange])

  const handlePreviewCampaign = useCallback(
    (campaignId: number) => {
      setPreviewCampaignId(campaignId)
      onPreviewOpen()
    },
    [onPreviewOpen],
  )

  return {
    // Tab state
    activeTab,
    setActiveTab,
    campaignView,

    // Data
    subscribers: subscribersQuery.data ?? [],
    isLoadingSubscribers: subscribersQuery.isLoading,
    stats: statsQuery.data,
    isLoadingStats: statsQuery.isLoading,
    campaigns: campaignsQuery.data ?? [],
    isLoadingCampaigns: campaignsQuery.isLoading,

    // Editing campaign
    editingCampaign,

    // Delete subscriber
    deleteSubscriberTarget,
    isDeleteSubscriberOpen,
    onDeleteSubscriberOpenChange,
    isDeletingSubscriber: deleteSubscriberMutation.isPending,
    handleDeleteSubscriberClick,
    handleConfirmDeleteSubscriber,

    // Campaign actions
    handleCreateCampaign,
    handleEditCampaign,
    handleBackToList,
    handleDeleteCampaignClick,

    // Send campaign
    sendCampaignTarget,
    isSendCampaignOpen,
    onSendCampaignOpenChange,
    isSendingCampaign: sendCampaignMutation.isPending,
    handleSendCampaignClick,
    handleConfirmSendCampaign,

    // Preview
    previewCampaignId,
    isPreviewOpen,
    onPreviewOpenChange,
    handlePreviewCampaign,
  }
}
