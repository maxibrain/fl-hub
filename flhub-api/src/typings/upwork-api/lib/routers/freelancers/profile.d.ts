declare namespace Upwork {
  namespace Freelancers {
    namespace Profile {
      interface Education {
        ed_from: string;
        ed_area: string;
        ed_to: string;
        ed_degree: string;
        ed_comment: string;
        ed_school: string;
      }

      interface Experience {
        exp_from: string;
        exp_to: string;
        exp_company: string;
        exp_comment: string;
        exp_title_raw: string;
      }

      interface PortfolioItem {
        pi_recno: string;
        pi_large_thumbnail: string;
        pi_title: string;
        pi_image: string;
      }

      interface Skill {
        skl_external_link: string;
        skl_has_tests: '0' | '1';
        skl_rank: string;
        skl_name: string;
        skl_description: string;
      }

      interface ProfileResponse {
        profile: {
          assignments: {
            hr: string;
            fp: string;
          };
          dev_ac_agencies: string;
          dev_adj_score: string;
          dev_adj_score_recent: string;
          dev_bill_rate: string;
          dev_billed_assignments: string;
          dev_blurb: string;
          dev_city: string;
          dev_country: string;
          dev_eng_skill: string;
          dev_first_name: string;
          dev_job_categories_v2: any;
          dev_last_activity: string;
          dev_last_name: string;
          dev_last_worked: string;
          dev_portfolio_items_count: string;
          dev_portfolio_items_v2_count: string;
          dev_portrait: string;
          dev_portrait_32: string;
          dev_portrait_100: string;
          dev_profile_title: string;
          dev_recno: string;
          dev_short_name: string;
          dev_timezone: string;
          dev_tot_feedback: string;
          dev_total_hours: string;
          dev_ui_profile_access: 'Public';
          ciphertext: string;
          education: {
            institution: Education | Array<Education>;
          };
          experiences: {
            experience: Experience | Array<Experience>;
          };
          portfolio_items: any;
          portfolio_items_v2: {
            portfolio_items_v: PortfolioItem | Array<PortfolioItem>;
          };
          skills: {
            skill: Skill | Array<Skill>;
          };
        };
        auth_user: {
          first_name: string;
          last_name: string;
          timezone: string;
          timezone_offset: string;
        };
        server_time: string;
      }

      class Profile {
        constructor(api: Upwork.Api.UpworkApi);
        getSpecific(key: string, callback: ResultCallback<ProfileResponse>): void;
        getSpecificBrief(key: string, callback: ResultCallback<ProfileResponse>): void;
      }
    }
  }
}

declare module 'upwork-api/lib/routers/freelancers/profile' {
  export = Upwork.Freelancers.Profile;
}
